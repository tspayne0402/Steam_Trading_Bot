const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const config = require('./config.json');

// Create Steam client instances
const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
  steam: client,
  community: community,
  language: 'en',
  pollInterval: 10000, // Poll every 10 seconds
  cancelTime: 300000 // Cancel outgoing trade offers after 5 minutes
});

// Connection retry handling
let reconnectDelay = 5;
const maxReconnectDelay = 300;

function logInToSteam() {
  const logOnOptions = {
    accountName: config.username,
    password: config.password,
    twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
  };

  try {
    client.logOn(logOnOptions);
  } catch (error) {
    console.error('Error during login:', error);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  console.log(`Reconnecting in ${reconnectDelay} seconds...`);
  setTimeout(() => {
    reconnectDelay = Math.min(reconnectDelay * 2, maxReconnectDelay);
    logInToSteam();
  }, reconnectDelay * 1000);
}

// Steam client event handlers
client.on('loggedOn', () => {
  console.log('Successfully logged into Steam');
  reconnectDelay = 5; // Reset reconnect delay on successful login
  
  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed(440);
});

client.on('webSession', (sessionid, cookies) => {
  console.log('Got web session');
  
  manager.setCookies(cookies);
  community.setCookies(cookies);
  
  // Start confirmation checker for mobile confirmations
  community.startConfirmationChecker(10000, config.identitySecret);
});

client.on('error', (error) => {
  console.error('Steam client error:', error);
  
  if (error.eresult === SteamUser.EResult.InvalidPassword || 
      error.eresult === SteamUser.EResult.AccountLoginDeniedThrottle) {
    console.error('Critical login error - stopping bot');
    process.exit(1);
  } else {
    scheduleReconnect();
  }
});

client.on('disconnected', (eresult, msg) => {
  console.log(`Disconnected from Steam. Reason: ${eresult} (${msg})`);
  scheduleReconnect();
});

// Trade offer manager event handlers
manager.on('newOffer', (offer) => {
  console.log(`New offer #${offer.id} from ${offer.partner.getSteamID64()}`);
  
  // Security check - only accept trades from trusted partners
  if (config.trustedPartners && config.trustedPartners.includes(offer.partner.getSteamID64())) {
    console.log(`Accepting offer from trusted partner: ${offer.partner.getSteamID64()}`);
    
    // Added delay to avoid rate limiting
    setTimeout(() => {
      offer.accept((err, status) => {
        if (err) {
          console.error(`Error accepting offer: ${err}`);
        } else {
          console.log(`Offer accepted. Status: ${status}`);
        }
      });
    }, 2000);
  } else {
    console.log(`Declining offer from untrusted partner: ${offer.partner.getSteamID64()}`);
    
    offer.decline((err) => {
      if (err) {
        console.error(`Error declining offer: ${err}`);
      } else {
        console.log('Offer declined successfully');
      }
    });
  }
});

manager.on('receivedOfferChanged', (offer, oldState) => {
  console.log(`Offer #${offer.id} changed: ${TradeOfferManager.ETradeOfferState[oldState]} -> ${TradeOfferManager.ETradeOfferState[offer.state]}`);
});

manager.on('pollFailure', (err) => {
  console.error('Error polling trades:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Logging off and shutting down...');
  client.logOff();
  setTimeout(() => process.exit(0), 1000);
});

// Start the bot
console.log('Steam trading bot starting...');
logInToSteam();