const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const config = require('./config.json');

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