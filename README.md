<!-- omit in toc -->
# Steam Margin Trading Bot

[![Creative Commons][cc-img]][cc-url]

This repo is for the development and implementation of a bot being used to trade on the Steam Community market. The initial steps taken to set this bot up were taken from [Andrew's Guide to Steam Bots](https://github.com/andrewda/node-steam-guide/).

This bot utilises the following nodes developed by [DoctorMcKay](https://github.com/DoctorMcKay):
- [steam-user](https://www.npmjs.com/package/steam-user)
- [steam-totp](https://www.npmjs.com/package/steam-totp)
- [steamcommunity](https://www.npmjs.com/package/steamcommunity)
- [steam-tradeoffer-manager](https://www.npmjs.com/package/steam-tradeoffer-manager)

<!-- omit in toc -->
# Table of Contents
- [1. Inspiration](#1-inspiration)
- [2. Bot Setup Guide](#2-bot-setup-guide)
  - [2.1 Initial Setup](#21-initial-setup)
- [3. Bot Functionality](#3-bot-functionality)

# 1. Inspiration

# 2. Bot Setup Guide
This section provides a guide based on our experiences for setting up this trading bot. The information contained within this is solely reflection of the process we undertook in coding and creating our trading bot.
For the initial stages of our bot's development, we leant heavily on [Andrew's Guide to Steam Bots][Andrew's Guide]. As such, the information contained within these earlier development headings only pertains to sections with Andrew's guide that we believe were either insufficient or outdated.

## 2.1 Initial Setup
Andrew's guide provided sufficient information in Chapters 1.1 - 1.3. However, when it came to TOTP setup, we found the information either impractical for our use case or was outdated.

In order to successfully extract the *sharedSecret* value for use by the TOTP, we used [this guide][TOTP SDA Guide] by [raabf][raabf github] which utilises the **3rd party application** Steam Desktop Authenticator. We used this because we will only be using the 2FA through the bot (or during development) and don't require access to the 2FA codes outside of this.

We found that the guides that detailed extracting these from an android or iphone were particularly convoluted and weren't necessary in our use case.

# 3. Bot Functionality


<!-- URLs -->

[cc-img]:               https://i.creativecommons.org/l/by-nc/4.0/88x31.png
[cc-url]:               https://creativecommons.org/licenses/by-nc/4.0/
[Andrew's Guide]:       https://github.com/andrewda/node-steam-guide/
[TOTP SDA Guide]:       https://github.com/KeeTrayTOTP/KeeTrayTOTP/blob/master/docs/secret_sda/steam_desktop_authenticator_sda.md
[raabf github]:         https://github.com/raabf