import * as dotenv from 'dotenv'
import * as IR from 'independentreserve'
import * as CS from 'coinspot-api'

// Grab configuration
dotenv.config()


// Test public data APIs
//var publicClient = new IR()


var IRClient = new IR( process.env.IR_KEY,  process.env.IR_SECRET)

// get ticker for BTCUSD
//IRClient.getMarketSummary("Eth", "Aud", console.log)

// get order book for BTCAUD
//publicClient.getOrderBook("Xbt", "Aud", console.log);

// get last 20 BTCAUD trades
//publicClient.getRecentTrades("Xbt", "Aud", 20, console.log);


var CSClient = new CS( process.env.CS_KEY,  process.env.CS_SECRET)

CSClient.quotesell('BTC', '1' function(e, data) {
 	console.log(data)
});
