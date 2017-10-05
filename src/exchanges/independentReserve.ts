import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import { ExchangeClass, marketSummary, feeStructure, currencyStructure, currencyCodeStructure } from '../libs/interfaces'


class IndependentReserve implements ExchangeClass {

    baseURL:       string
    marketName:    string
    currencyCodes: currencyCodeStructure


    constructor(){
        this.baseURL    = 'https://api.independentreserve.com'
        this.marketName = 'IndependentReserve'
        this.currencyCodes = {
            bitcoin: 'xbt',
            ether:   'eth',
            aud:     'aud'
        }
    }




    feeStructure(): feeStructure {
        return {
            bitcoinWithdrawl: 0.001, // bitcoin
            etherWithdrawl:   0.004, // bitcoin
            audWithdrawl:     0,     //
            makerFee:         .5,    // percent usd
            takerFee:         .5,    // percent usd
            tradingFee:       .5     // percent usd
        }
    }



    getMarketData( currencies: currencyStructure ): any {
        let options = {
            uri: `${this.baseURL}/Public/GetMarketSummary`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            qs: {
                primaryCurrencyCode:   this.currencyCodes[currencies.base],
                secondaryCurrencyCode: this.currencyCodes[currencies.against]
            },
            json: true // Automatically parses the JSON string in the response
        };

        return request(options)
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
            dayHigh:   data.DayHighestPrice,
            dayLow:    data.DayLowestPrice,
            lastPrice: data.LastPrice,
            bidPrice:  data.CurrentHighestBidPrice,
            askPrice:  data.CurrentLowestOfferPrice,
        }
    }






}


export let independentReserve = new IndependentReserve()
