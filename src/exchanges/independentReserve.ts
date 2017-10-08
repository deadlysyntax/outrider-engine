import * as request from 'request-promise'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import sha256, { Hash, HMAC } from "fast-sha256"

import * as dotenv from 'dotenv'
dotenv.config()

import { ExchangeClass, marketSummary, feeStructure, currencyStructure, currencyCodeStructure } from '../libs/interfaces'


class IndependentReserve implements ExchangeClass {

    baseURL:       string
    marketName:    string
    currencyCodes: currencyCodeStructure
    apiKey:        string


    constructor(){
        this.baseURL    = 'https://api.independentreserve.com'
        this.marketName = 'IndependentReserve'
        this.currencyCodes = {
            bitcoin: 'xbt',
            ether:   'eth',
            aud:     'aud'
        }
        this.apiKey = process.env.INDEPENDENT_RESERVE_API_KEY
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


    //
    //
    //
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





    //
    //
    //
    getAccountData( ): Observable<any> {
        // Use timestamp as iterating nonce
        let url       = `${this.baseURL}/Private/GetAccounts`
        let nonce     = Math.floor(Date.now() / 1000)
        let body      = [
            `apiKey=${this.apiKey}`,
            `nonce=${nonce}`
        ]
        let message   = `${url} ${body.join(',')}`
        const h = new HMAC(key); // also Hash and HMAC classes
        const mac = h.update(data).digest();
        let signature = crypto.mac('hmac', 'sha256', '', {}).update(`${message}`).finalize().stringify('hex')
        // Set options
        let options = {
            method:  'POST',
            uri:     url,
            headers: {
                'User-Agent': 'Request-Promise',
            },
            body: {
                apiKey:    this.apiKey,
                nonce:     nonce,
                signature: signature,
            },
            json: true // Automatically parses the JSON string in the response
        };
        return Observable.fromPromise(request(options))
    }






    //
    //
    //
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
