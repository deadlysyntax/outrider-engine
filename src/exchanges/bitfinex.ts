import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'


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
            console.log( this.fieldMapping('tickers', response[0]))
        },
        error => {
            console.log(error)
        })
    }





    fieldMapping( type: string, data: Array<any> ): any{
        switch(type){
            case 'tickers':
                return {
                    SYMBOL:            data[0],
                    BID:               data[1],
                    BID_SIZE:          data[2],
                    ASK:               data[3],
                    ASK_SIZE:          data[4],
                    DAILY_CHANGE:      data[5],
                    DAILY_CHANGE_PERC: data[6],
                    LAST_PRICE:        data[7],
                    VOLUME:            data[8],
                    HIGH:              data[9],
                    LOW:               data[10]
                }
            default:
                return null
        }
    }

}

export let bitFinex = new BitFinex()
