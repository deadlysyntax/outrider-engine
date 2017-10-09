import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import * as crypto from 'crypto'

import { ExchangeClass, marketSummary, feeStructure, currencyStructure, currencyCodeStructure } from '../libs/interfaces'

import * as dotenv from 'dotenv'
dotenv.config()

class BTCMarkets implements ExchangeClass {

    baseURL:       string
    marketName:    string
    currencyCodes: currencyCodeStructure
    apiKey:        string
    apiSecret:     string


    constructor(){
        this.baseURL       = 'https://api.btcmarkets.net'
        this.marketName    = 'BTCMarkets'
        this.currencyCodes = {
            bitcoin: 'BTC',
            ether:   'ETH',
            aud:     'AUD'
        }
        this.apiKey    = process.env.BTC_MARKETS_API_KEY
        this.apiSecret = process.env.BTC_MARKETS_SECRET
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
        let options = {
            uri: `${this.baseURL}/market/${this.currencyCodes[currencies.base]}/${this.currencyCodes[currencies.against]}/tick`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        }
        return request(options)
    }






    //
    //
    //
    getAccountData( ): Observable<any> {
        // Need this for signature
        let url       = '/account/balance'
        let nonce     = (new Date()).getTime() // Use timestamp as iterating nonce


        let signature = crypto.createHmac('sha512', new Buffer(this.apiSecret, 'base64'))
                           .update(`${url}\n${nonce}\n`)
                           .digest('base64')
        console.log(signature)
        //
        let options = {
            method: 'GET',
            uri: `${this.baseURL}${url}`,
            headers: {
                //"Accept":         "application/json",
                //"Accept-Charset": "UTF-8",
                //"Content-Type":   "application/json",
                'User-Agent':     'Outrider',
                'apikey':         this.apiKey,
                'timestamp':      nonce,
                'signature':      signature
            },
            json: true // Automatically parses the JSON string in the response
        }
        return Observable.fromPromise(request(options))
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
