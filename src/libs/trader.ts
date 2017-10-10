import { reportStructure, ExchangeClass, exchangeBalanceStructure, exchangeBalanceSummary } from './interfaces'

import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/catch'
import * as sql from 'sqlite3'


import {independentReserve as IndependentReserve } from '../exchanges/independentReserve'
import { btcMarkets as BTCMarkets } from '../exchanges/BTCMarkets'

import config from '../config'

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
        console.log('Initiating Arbitrage Trade')
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
        console.log('Checking funds across exchanges')
        this.getExchangeBalances().subscribe( ( response: exchangeBalanceSummary ) => {
            // Calculate if we have enough to trade
            //if( response.buy.bitcoin >  )
            //console.log(response)
        })



        return true
    }






    // Combine all the exchange balances into one object
    getExchangeBalances(): Observable<exchangeBalanceSummary> {
        return Observable.create( ( observer: Observer<exchangeBalanceSummary> ) => {
            Observable.forkJoin(
                [
                    this.report.arbitrageCalculations.buy,
                    this.report.arbitrageCalculations.sell
                ]
                .map( market => this.markets[market.exchange].getAccountData() )
            )
            .subscribe( ( response: any ) => {
                // Normalize data from different exchanges into the right format
                let buy  = this.markets[this.report.arbitrageCalculations.buy.exchange].formatBalanceData(response[0]) // repsonse[0] is always buy because it's the first index of the above array in forkJoin
                let sell = this.markets[this.report.arbitrageCalculations.sell.exchange].formatBalanceData(response[1])
                observer.next({ buy, sell })
            })
        })
    }




}


export default Trader
