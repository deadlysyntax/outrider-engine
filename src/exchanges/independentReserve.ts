import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'

import { ExchangeClass, marketSummary, feeStructure } from '../libs/interfaces'


class IndependentReserve implements ExchangeClass {

    baseURL: string


    constructor(){
        this.baseURL = 'https://api.independentreserve.com'
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
        return Observable.create( (observer: Observer<marketSummary>) => {
            this.getMarketData().then( response => {
                observer.next( this.marketSummaryFieldMapping(response) )
            })
            .catch( error => {
                observer.error('Couldn\'t find market data')
            })
        })
    }





    marketSummaryFieldMapping( data: any ): marketSummary{
        return {
            dayHigh:   data.DayHighestPrice,
            dayLow:    data.DayLowestPrice,
            lastPrice: data.LastPrice,
            bidPrice:  data.CurrentHighestBidPrice,
            askPrice:  data.CurrentLowestOfferPrice,
        }
    }






}


export let independentReserve = new IndependentReserve()
