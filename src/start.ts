import * as dotenv from 'dotenv'
import {independentReserve as IndependentReserve } from './exchanges/independentReserve'
import { btcMarkets as BTCMarkets } from './exchanges/BTCMarkets'
//import { ACX } from './exchanges/acx'
//import { bitFinex as BitFinex } from './exchanges/bitfinex'
//import * as ws from 'ws'
import { reportStructure } from './libs/interfaces'

import MarketWatcher from './libs/marketWatcher'
import Trader from './libs/trader'

import config from './config'


import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/catch'


// To be plugged in to the watcher
import { buildMarketReport, calculateSpread, arbitrageIdentifier, addTimestamp } from './plugins/buildMarketReport'

import * as mongodb from 'mongodb'





//
// MongoDB Database connection. Set this up before intializing bot
//
const url  = 'mongodb://localhost:27017/outrider'
const db   = mongodb.MongoClient.connect(url, (err, db) => {
     if(err) throw err;
     // Run initially
     run(db)
     // And ever ten seconds thereafter
     setInterval(() => {
         run(db)
     }, 10000)
})







//
// Our bot mechanism
//
let run = ( db: any ) => {
    // Can pass in the currency pair such as ether/aud or bitcoin/aud
    // Note - use full words for ether and bitcoin (as specified by the currencyCodeStructure interface )
    // This is because different exchanges use different codes, so we convert them before requesitng data
    let currency = process.argv[2].split('/')
    // Initialize our market watcher
    let MarketSubscription = new MarketWatcher(
            [ BTCMarkets, IndependentReserve ],
            { base: currency[0], against: currency[1] },
            // These a chain of plugins that get called every iteration,
            // All these manipulate each report somehow.
            // These are known as 'plugins' and can be found in the /plugins directory - they have a very speciifc signature
            [ buildMarketReport(config), calculateSpread(config), arbitrageIdentifier(config, { BTCMarkets, IndependentReserve }), addTimestamp(config) ]
    )


    // Builds a report from all the return
    MarketSubscription.compileReport()
        .subscribe( ( report: reportStructure ) => {
            console.log('Report Produced')
            console.log('Trade Threshhold Met:', report)
            // Add a unique id field using the date and a couple of rando strings
            // This is ugly, but mongo was throwing up duplicate id key errors
            //let saveableReport = Object.assign({}, report, {_id: Math.floor(Date.now()+Math.random()+ Math.random())})
            // Save viable trades to the database
            Observable.fromPromise(db.collection('arbitrage').insert(report)).subscribe(
                ( result: any ) => {
                    //console.log(result)
                },
                ( error: any ) => {
                    console.log(error, 'error')
                }
            )
            // Check if we're live trading
            if( typeof  process.argv[3] !== 'undefined' && process.argv[3] === 'trade')
                runTrader(report)
        },
        ( error: any ) => {
            console.log(error)
        })
}








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
