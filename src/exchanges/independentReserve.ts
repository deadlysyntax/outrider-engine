import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'

import { marketSummary } from '../libs/interfaces'


class IndependentReserve {

    baseURL: string


    constructor(){
        this.baseURL = 'https://api.independentreserve.com'
    }



    getMarketData(){
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





    getMarketSummary(): void{
        let ir = Observable.fromPromise(this.getMarketData() )

        ir.subscribe( response => {
            console.log( 'idr', this.marketSummaryFieldMapping(response) )
        },
        error => {
            console.log(error)
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
