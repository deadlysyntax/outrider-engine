import * as dotenv from 'dotenv'
import {independentReserve as IndependentReserve } from './exchanges/independentReserve'
import { btcMarkets as BTCMarkets } from './exchanges/BTCMarkets'
//import { ACX } from './exchanges/acx'
//import { bitFinex as BitFinex } from './exchanges/bitfinex'
//import * as ws from 'ws'
import { reportStructure } from './libs/interfaces'

import MarketWatcher from './libs/marketWatcher'
import Trader from './libs/trader'


import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/catch'
import * as sql from 'sqlite3'



// To be plugged in to the watcher
import { buildMarketReport, calculateSpread, arbitrageIdentifier } from './plugins/buildMarketReport'


// Grab configuration
sql.verbose()

let db = new sql.Database('db/outrider.sqlite', sql.OPEN_READWRITE)


let run = () => {
    // Can pass in the currency pair such as ether/aud or bitcoin/aud
    // Note - use full words for ether and bitcoin (as specified by the currencyCodeStructure interface )
    // This is because different exchanges use different codes, so we convert them before requesitng data
    let currency = process.argv[2].split('/')

    // Initialize our market watcher
    let MarketSubscription = new MarketWatcher(
            [ BTCMarkets, IndependentReserve ],
            { base: currency[0], against: currency[1] },
            [ buildMarketReport(), calculateSpread(), arbitrageIdentifier() ]
    )


    MarketSubscription.compileReport()
        .subscribe( ( report: reportStructure ) => {
            console.log('Report Produced')
            console.log('Trade Threshhold Met: %s', report.arbitrageCalculations.thresholdMet)
            // Save viable trades to the database to monitor
            db.run(`INSERT INTO arbitrage (data) VALUES ( ? )`, JSON.stringify(report))
            // Check if we're live trading
            if( typeof  process.argv[3] !== 'undefined' && process.argv[3] === 'trade')
                runTrader(report)
        },
        ( error: any ) => {
            console.log(error)
        })

}
// Run initially
run()
// And ever ten seconds thereafter
setInterval(run, 10000)







// Initializes and runs our trading system
let runTrader = ( report: reportStructure ) => {
    let trade = new Trader(report)
        .initialize()
        .subscribe(
            ( response: any ) => {
                console.log(response, 'trade next response')
            },
            ( error: any ) => {
                console.log(error, 'trade error')
            },
            () => {
                console.log('Trade Complete')
            }
        )
}
