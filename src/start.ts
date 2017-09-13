import * as dotenv from 'dotenv'
import {independentReserve as IndependentReserve } from './exchanges/independentReserve'
//import { ACX } from './exchanges/acx'
import { bitFinex as BitFinex } from './exchanges/bitfinex'
//import * as ws from 'ws'

import MarketWatcher from './libs/marketWatcher'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'


// To be plugged in to the watcher
import { buildMarketReport, calculateSpread } from './plugins/buildMarketReport'


// Grab configuration
dotenv.config()

let run = () => {


    let MarketSubscription = new MarketWatcher(
            [ BitFinex, IndependentReserve ],
            { base: 'eth', against: 'usd' },
            [ buildMarketReport(), calculateSpread() ]
    )


    MarketSubscription.compileReport()
        .subscribe( report => {
            console.log(report, 'report')
        })



}
run()
