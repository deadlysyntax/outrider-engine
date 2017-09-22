import * as dotenv from 'dotenv'
import {independentReserve as IndependentReserve } from './exchanges/independentReserve'
import { btcMarkets as BTCMarkets } from './exchanges/BTCMarkets'
//import { ACX } from './exchanges/acx'
//import { bitFinex as BitFinex } from './exchanges/bitfinex'
//import * as ws from 'ws'

import MarketWatcher from './libs/marketWatcher'
import { arbitrage as Arbitrage } from './libs/arbitrage'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'


// To be plugged in to the watcher
import { buildMarketReport, calculateSpread } from './plugins/buildMarketReport'


// Grab configuration
dotenv.config()

let run = () => {


    let MarketSubscription = new MarketWatcher(
            [ BTCMarkets, IndependentReserve ],
            { base: 'bitcoin', against: 'aud' },
            [ buildMarketReport(), calculateSpread() ]
    )


    MarketSubscription.compileReport()
        .subscribe( report => {
            Arbitrage.identifyOpportunity(report)
                .subscribe( opportunity => {
                    console.log(opportunity, 'oppor')

                    if( ! opportunity.found )
                        return

                    //console.log('Found an opportunity')

                })
        })



}
run()
