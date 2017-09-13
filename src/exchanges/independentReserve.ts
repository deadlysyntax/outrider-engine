import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import { ExchangeClass, marketSummary, feeStructure } from '../libs/interfaces'


class IndependentReserve implements ExchangeClass {

    baseURL:    string
    marketName: string


    constructor(){
        this.baseURL    = 'https://api.independentreserve.com'
        this.marketName = 'Independent Reserve'
    }



    feeStructure(): feeStructure {
        return {
            xbtWithdrawl: 0.001,
            ethWithdrawl: 0.004,
            audWithdrawl: 0,
            makerFee:     null,
            takerFee:     null
        }
    }



    getMarketData(): Promise<any> {
        let options = {
            uri: `${this.baseURL}/Public/GetMarketSummary`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            qs: {
                primaryCurrencyCode:   'eth',
                secondaryCurrencyCode: 'usd'
            },
            json: true // Automatically parses the JSON string in the response
        };

        return request(options)
    }





    getMarketSummary(): Observable<any> {
        return Observable
            .fromPromise( this.getMarketData() )
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
