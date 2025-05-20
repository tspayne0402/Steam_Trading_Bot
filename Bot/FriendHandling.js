const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const config = require('./config.json');
const { SteamID } = require('steam-tradeoffer-manager');

const client = new SteamUser();

const logOnOptions = {
  accountName: config.username,
  password: config.password,
  twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  console.log('Logged into Steam');
  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed(440);
});

// Handling for when we get a new friend request
client.on('friendRelationship', (SteamID, relationship) => {
    if (relationship === 2) {
        client.addFriend(SteamID);
        client.chatMessage(SteamID, "Thanks for adding me, are you interested in trading?");
    }
});