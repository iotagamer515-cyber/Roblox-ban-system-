# Roblox-ban-system-
# Roblox Ban System (Telegram Controlled)

Made with ❤️ by **Saksham**

This project is a simple **Username-Based Ban System** for Roblox, fully controlled through a **Telegram Bot**.

## ⭐ Features
- Receive notification when a player executes your script
- Ban/Unban any username directly from Telegram
- Auto-kick banned users through Roblox script
- Simple Node.js backend (works on Render)
- Ban list saved in a JSON file

## 🚀 API Routes
### `POST /check`
Used by the Roblox script.  
Returns whether the username is banned or not.

### `POST /telegram`
Telegram webhook for receiving bot commands:
