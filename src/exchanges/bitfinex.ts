import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'

import { marketSummary } from '../libs/interfaces'



class BitFinex {

    baseURL: string


    constructor(){
        this.baseURL = 'https://api.bitfinex.com/v2/'
    }



    getMarketData(){
        let options = {
            uri: `${this.baseURL}/tickers`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            qs: {
                symbols: 'tETHUSD'
            },
            json: true // Automatically parses the JSON string in the response
        };

        return request(options)
    }





    getMarketSummary(): void{
        let bfx = Observable.fromPromise( this.getMarketData() )


        bfx.subscribe( response => {
            console.log( 'bfx', this.marketSummaryFieldMapping(response[0]))
        },
        error => {
            console.log(error)
        })
    }





    marketSummaryFieldMapping(data: Array<any> ): marketSummary {
        return {
            dayHigh:   data[9],
            dayLow:    data[10],
            lastPrice: data[7],
            bidPrice:  data[1],
            askPrice:  data[3],
        }
    }

}

export let bitFinex = new BitFinex()
