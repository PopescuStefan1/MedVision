const express = require("express");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const cors = require("cors");

admin.initializeApp({
    credential: admin.credential.cert(require("./licenta-fb443-firebase-adminsdk-m98dj-62562201d5.json")),
});

const app = express();
app.use(
    cors({
        origin: "http://localhost:4200",
        credentials: true,
        methods: ["GET", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use(express.json());
app.use(cookieParser());

// helper to verify session cookie
async function verifySession(req, res, next) {
    const sessionCookie = req.cookies.__session || "";
    try {
        const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decoded; // contains uid, email, etc.
        next();
    } catch (e) {
        console.error("Session verify failed:", e);
        res.status(401).send("Unauthorized");
    }
}

app.post("/sessionLogin", async (req, res) => {
    console.log("Session login");
    const { idToken } = req.body;
    try {
        // Verify Firebase ID token
        await admin.auth().verifyIdToken(idToken);

        // Create session cookie
        const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

        // Set it as an HttpOnly cookie
        res.cookie("__session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: false, // set to true in prod over HTTPS
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).send({ status: "success" });
    } catch (e) {
        console.error("sessionLogin failed:", e);
        return res.status(401).send("Unauthorized");
    }
});

app.post("/deleteAccount", verifySession, async (req, res) => {
    console.log("In delete account");
    const uid = req.user.uid;
    try {
        // 1) Delete the Firebase Auth user
        await admin.auth().deleteUser(uid);

        // 2) Optionally delete the Firestore profile doc
        await admin.firestore().collection("users").doc(uid).delete();

        // 3) Clear the session cookie
        res.clearCookie("__session", { path: "/" });

        return res.status(200).send({ status: "deleted" });
    } catch (err) {
        console.error("DeleteAccount error:", err);
        return res.status(500).send("Server error");
    }
});

// start server
app.listen(3000, () => console.log("Server listening on http://localhost:3000"));
