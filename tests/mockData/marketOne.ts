import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
//import * as crypto from 'crypto'

import { ExchangeClass, marketSummary, feeStructure, currencyStructure, currencyCodeStructure, exchangeBalanceStructure } from '../../src/libs/interfaces'

//import * as dotenv from 'dotenv'
//dotenv.config()

class MarketOne implements ExchangeClass {

    baseURL:       string
    marketName:    string
    currencyCodes: currencyCodeStructure
    apiKey:        string
    apiSecret:     string


    constructor(){
        this.baseURL       = ''
        this.marketName    = 'MarketOne'
        this.currencyCodes = {
            bitcoin: 'BTC',
            ether:   'ETH',
            aud:     'AUD'
        }
        this.apiKey    = ''
        this.apiSecret = ''
    }

//

    feeStructure(): feeStructure {
        return {
            bitcoinWithdrawl: 0.0005, // bitcoin
            etherWithdrawl:   0.001,  // bitcoin
            audWithdrawl:     0,
            makerFee:        .85,// percent
            takerFee:        .85,// percenct
            tradingFee:      .85 // percent
        }
    }



    //
    //
    //
    getMarketData( currencies: currencyStructure ): any {
        return new Promise( ( resolve, reject ) => {
            resolve({
                lastPrice: 4500,
                bestBid:   4000,
                bestAsk:   5000,
            })
        })
    }






    //
    //
    //
    getAccountData( ): Observable<any> {
        return Observable.create(
            ( observer: Observer<any> ) => {
                observer.next('Empty')
            }
        )
    }






    getMarketSummary( currencies: currencyStructure ): Observable<any> {
        return Observable
            .fromPromise(
                this.getMarketData(currencies)
            )
            .map( response => {
                return this.marketSummaryFieldMapping( response )
            })
    }





    marketSummaryFieldMapping( data: any ): marketSummary{
        return {
            name:      this.marketName,
            dayHigh:   0,
            dayLow:    0,
            lastPrice: data.lastPrice,
            bidPrice:  data.bestBid,
            askPrice:  data.bestAsk,
        }
    }




    formatBalanceData( data: Array<any> ): exchangeBalanceStructure {
        return {
            marketName: this.marketName,
            aud: data.filter( ( currency: any ) => {
                return currency.currency === this.currencyCodes['aud']
            }).map( ( currency: any ) => currency.balance )[0],
            bitcoin: data.filter( ( currency: any ) => {
                return currency.currency === this.currencyCodes['bitcoin']
            }).map( ( currency: any ) => currency.balance )[0],
            ether: data.filter( ( currency: any ) => {
                return currency.currency === this.currencyCodes['ether']
            }).map( ( currency: any ) => currency.balance )[0],
        }
    }







}


export let marketOne = new MarketOne()
