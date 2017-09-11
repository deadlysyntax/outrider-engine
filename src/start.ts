import * as dotenv from 'dotenv'
import {independentReserve as IndependentReserve } from './exchanges/independentReserve'
//import { ACX } from './exchanges/acx'
import { bitFinex as BitFinex } from './exchanges/bitfinex'
//import * as ws from 'ws'

import { marketWatcher as MarketWatcher } from './libs/marketWatcher'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'


// Grab configuration
dotenv.config()

let run = () => {

    MarketWatcher
        .setMarkets([ BitFinex, IndependentReserve ])
        .watch()
}
run()
