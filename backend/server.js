const express = require("express");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

admin.initializeApp({
    credential: admin.credential.cert(require("./licenta-fb443-firebase-adminsdk-m98dj-62562201d5.json")),
});

const app = express();
app.use(
    cors({
        origin: "https://localhost:4200",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

async function verifySession(req, res, next) {
    const sessionCookie = req.cookies.__session || "";
    try {
        const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).send("Unauthorized");
    }
}

app.post("/sessionLogin", async (req, res) => {
    const { idToken } = req.body;
    try {
        await admin.auth().verifyIdToken(idToken);

        const expiresIn = 5 * 24 * 60 * 60 * 1000;
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

        res.cookie("__session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return res.status(200).send({ status: "success" });
    } catch (e) {
        return res.status(401).send("Unauthorized");
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("__session", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.status(200).send({ message: "Logged out" });
});

app.post("/deleteAccount", verifySession, async (req, res) => {
    const uid = req.user.uid;
    try {
        await admin.auth().deleteUser(uid);

        await admin.firestore().collection("users").doc(uid).delete();

        res.clearCookie("__session", { path: "/" });

        return res.status(200).send({ status: "deleted" });
    } catch (err) {
        return res.status(500).send("Server error");
    }
});

const options = {
    key: fs.readFileSync("localhost+2-key.pem"),
    cert: fs.readFileSync("localhost+2.pem"),
};

https.createServer(options, app).listen(3000, () => console.log("HTTPS server listening on https://localhost:3000"));

// app.listen(3000, () => console.log("Server listening on http://localhost:3000"));
