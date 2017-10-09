import { reportStructure, ExchangeClass } from './interfaces'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/catch'
import * as sql from 'sqlite3'


import {independentReserve as IndependentReserve } from '../exchanges/independentReserve'
import { btcMarkets as BTCMarkets } from '../exchanges/BTCMarkets'


class Trader {

    report: reportStructure
    toTrade: boolean
    markets: any

    constructor( report: reportStructure ) {
        this.report  = report
        this.markets = {
            BTCMarkets,
            IndependentReserve
        }
        this.toTrade = this.tradeDecision()
        console.log('Initiatng Arbitrage Trade')
        return this
    }





    initialize(): Observable<any> {
        return Observable.create( ( observer: any ) => {
            if( this.toTrade !== true )
                observer.error('Decided to not trade')
            // Place trade orders
            observer.complete()
        })
    }





    tradeDecision(): boolean {
        console.log('Checking funds across exchanges', this.report)

        let buy  = this.report.arbitrageCalculations.buy
        let sell = this.report.arbitrageCalculations.sell
        //
        let buyTransaction = this.markets[buy.exchange].getAccountData()
        .subscribe( ( response: any ) => {
            console.log(response, 'BUY: '+ buy.exchange)
        },
        ( error: any ) => {
            console.log(error)
        })

        let sellTransaction = this.markets[sell.exchange].getAccountData()
        .subscribe( ( response: any ) => {
            console.log(response, 'SELL: '+sell.exchange )
        },
        ( error: any ) => {
            console.log(error)
        })

        // Get wallet amount at each exchange


        return true
    }
}


export default Trader
