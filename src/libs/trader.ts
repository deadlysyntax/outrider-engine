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
        this.toTrade = false //this.tradeDecision()
        console.log('Initiating Arbitrage Trade')
        return this
    }





    initialize(): Observable<any> {
        return Observable.create( ( observer: any ) => {

            this.tradeDecision().subscribe( () => {
                // Send trade signal if ready
                observer.complete()
            },
            (error) => {
                observer.error(error)
            })
        })
    }





    tradeDecision(): Observable<boolean> {
        console.log('Checking funds across exchanges')
        return Observable.create( ( observer: Observer<any>) => {
            this.getExchangeBalances().subscribe( ( response: exchangeBalanceSummary ) => {
                // Calculate if we have enough to trade
                if( ! this.verifyFunds(this.report, response, config.tradePercent) ) {
                    console.log('Funds not available')
                    observer.error(false)
                }
                console.log('Ready to trade')
                observer.next(true)
            })
        })
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






    // Confirm that there is enough funds in the selected exchanges to complete the trade
    verifyFunds( report: reportStructure,  balanceSummary: exchangeBalanceSummary, tradePercent: number ): boolean {
        // The defaultTradeValue is the percentage of the base token we're going to buy and sell
        console.log(report, balanceSummary, tradePercent)
        return true
    }




}


export default Trader
