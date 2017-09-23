import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import { ExchangeClass, marketSummary, feeStructure, currencyStructure, currencyCodeStructure } from '../libs/interfaces'


class BTCMarkets implements ExchangeClass {

    baseURL:       string
    marketName:    string
    currencyCodes: currencyCodeStructure


    constructor(){
        this.baseURL       = 'https://api.btcmarkets.net'
        this.marketName    = 'BTCMarkets'
        this.currencyCodes = {
            bitcoin: 'BTC',
            ether:   'ETH',
            aud:     'AUD'
        }
    }

//

    feeStructure(): feeStructure {
        return {
            xbtWithdrawl: 0.0005,
            ethWithdrawl: 0.001,
            audWithdrawl: 0,
            makerFee:     .85,
            takerFee:     .85,
            tradingFee:   .85
        }
    }



    getMarketData( currencies: currencyStructure ): any {
        let options = {
            uri: `${this.baseURL}/market/${this.currencyCodes[currencies.base]}/${this.currencyCodes[currencies.against]}/tick`,
            headers: {
                'User-Agent': 'Request-Promise'
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
            dayHigh:   0,
            dayLow:    0,
            lastPrice: data.lastPrice,
            bidPrice:  data.bestBid,
            askPrice:  data.bestAsk,
        }
    }






}


export let btcMarkets = new BTCMarkets()
