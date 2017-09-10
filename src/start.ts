import * as dotenv from 'dotenv'
import {independentReserve as IndependentReserve } from './exchanges/independentReserve'
//import { ACX } from './exchanges/acx'
//import * as CS from 'coinspot-api'
import { bitFinex as BitFinex } from './exchanges/bitfinex'
//import * as ws from 'ws'

//import { Observable } from 'rxjs/Observable'
//import 'rxjs/add/observable/forkJoin'
//import 'rxjs/add/observable/fromPromise'

// Grab configuration
dotenv.config()

//let IRClient = new IR( process.env.IR_KEY,  process.env.IR_SECRET)
//let CSClient = new CS( process.env.CS_KEY,  process.env.CS_SECRET)

let run = () => {

    BitFinex.getMarketSummary()


    IndependentReserve.getMarketSummary()




}
run()
