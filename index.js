import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = "8542259973:AAELrCAnV4et6S_RvxA-UwVTLXN2lKDTqKY";
const CHAT_ID = "7704430523";

const TG_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// Ban list file
const BAN_FILE = "./banlist.json";

// If ban file missing → create empty
if (!fs.existsSync(BAN_FILE)) {
    fs.writeFileSync(BAN_FILE, JSON.stringify([]));
}

// Read ban list
function getBanList() {
    return JSON.parse(fs.readFileSync(BAN_FILE));
}

// Save ban list
function saveBanList(list) {
    fs.writeFileSync(BAN_FILE, JSON.stringify(list));
}

// MAIN API — Roblox Script calls this
app.post("/check", async (req, res) => {
    const username = req.body.username;

    if (!username) return res.json({ error: "No username provided" });

    const banList = getBanList();
    const isBanned = banList.includes(username);

    // Send notification to Telegram
    await axios.post(TG_URL, {
        chat_id: CHAT_ID,
        text: `⚡ New Execution\n👤 Username: ${username}\n🚫 Banned: ${isBanned}`
    });

    res.json({ banned: isBanned });
});

// Telegram bot commands
app.post("/telegram", async (req, res) => {
    const msg = req.body.message;
    if (!msg) return res.sendStatus(200);

    const text = msg.text;
    const chatId = msg.chat.id;

    if (chatId != CHAT_ID) return res.sendStatus(200);

    const parts = text.split(" ");
    const cmd = parts[0];
    const user = parts[1];

    if (cmd === "/ban") {
        if (!user) return;

        const list = getBanList();
        if (!list.includes(user)) {
            list.push(user);
            saveBanList(list);
        }

        await axios.post(TG_URL, {
            chat_id: CHAT_ID,
            text: `✅ *${user}* banned successfully`
        });
    }

    if (cmd === "/unban") {
        const list = getBanList();
        saveBanList(list.filter(u => u !== user));

        await axios.post(TG_URL, {
            chat_id: CHAT_ID,
            text: `♻️ *${user}* unbanned successfully`
        });
    }

    if (cmd === "/check") {
        const list = getBanList();
        const banned = list.includes(user);

        await axios.post(TG_URL, {
            chat_id: CHAT_ID,
            text: `🔍 Ban Status for *${user}*: ${banned}`
        });
    }

    res.sendStatus(200);
});

// Webhook for Telegram (set this later)
app.get("/", (req, res) => {
    res.send("Ban System Running");
});

app.listen(3000, () => console.log("Server Running"));