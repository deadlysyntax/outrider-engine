import * as dotenv from 'dotenv'
import {independentReserve as IndependentReserve } from './exchanges/independentReserve'
//import { ACX } from './exchanges/acx'
import { bitFinex as BitFinex } from './exchanges/bitfinex'
//import * as ws from 'ws'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'


// Grab configuration
dotenv.config()

//let IRClient = new IR( process.env.IR_KEY,  process.env.IR_SECRET)
//let CSClient = new CS( process.env.CS_KEY,  process.env.CS_SECRET)

let run = () => {

    let markets             = [BitFinex, IndependentReserve]
    let marketSummaries     = Observable.forkJoin(
        ...markets.map( market => market.getMarketSummary() )
    )

    const subscribe = marketSummaries.subscribe(
        market => {
            console.log( market, 'market')
        },
        error => {
            console.log(error)
        }
    )


}
run()
