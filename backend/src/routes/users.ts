import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).send({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        res.send({ message: "User created" });
    } catch (e) {
        res.status(500).send({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ error: "Wrong password" });
        }

        const token = jwt.sign(
            { id: user._id },
            "secret_key"
        );

        user.token = token;
        await user.save();

        res.send({ token, username: user.username });
    } catch (e) {
        res.status(500).send({ error: "Server error" });
    }
});

router.delete("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({ error: "No token" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).send({ error: "Invalid token" });
        }

        user.token = null;
        await user.save();

        res.send({ message: "Logged out" });
    } catch (e) {
        res.status(500).send({ error: "Server error" });
    }
});

export default router;