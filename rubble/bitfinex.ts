import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import { ExchangeClass, marketSummary, feeStructure, currencyStructure } from '../libs/interfaces'



class BitFinex implements ExchangeClass {

    baseURL:    string
    marketName: string


    constructor(){
        this.baseURL    = 'https://api.bitfinex.com/v2/'
        this.marketName = 'BitFinex'
    }




    feeStructure(): feeStructure {
        return {
            xbtWithdrawl: 0.0004,
            ethWithdrawl: 0.01,
            audWithdrawl: null,
            makerFee:     .1,
            takerFee:     .2
        }
    }



    getMarketData( currencies: currencyStructure ): any {
        let options = {
            uri: `${this.baseURL}/tickers`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            qs: {
                symbols: `t${currencies.base.toUpperCase()}${currencies.against.toUpperCase()}` //tETHUSD'
            },
            json: true // Automatically parses the JSON string in the response
        };

        return request(options)
    }





    getMarketSummary( currencies: currencyStructure ): Observable<any> {
        return Observable
            .fromPromise( this.getMarketData(currencies) )
            .map( ( response: any ) => {
                return this.marketSummaryFieldMapping( response[0] )
            })
    }





    marketSummaryFieldMapping( data: Array<any> ): marketSummary {
        return {
            name:      this.marketName,
            dayHigh:   data[9],
            dayLow:    data[10],
            lastPrice: data[7],
            bidPrice:  data[1],
            askPrice:  data[3],
        }
    }

}

export let bitFinex = new BitFinex()
