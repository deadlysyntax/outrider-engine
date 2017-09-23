import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import config from '../config'

import { reportStructure, arbitrageCalculationStructure, tradeCalculationStructure } from './interfaces'

import { btcMarkets as BTCMarkets } from '../exchanges/BTCMarkets'
import { independentReserve as IndependentReserve } from '../exchanges/independentReserve'


class Arbitrage {

    exchanges: any

    constructor() {
        // Proxy class to help us dynamically call these classes
        this.exchanges = {
            IndependentReserve,
            BTCMarkets
        }
    }


    calculate( report: reportStructure ): any {
        // We expect the highest bid to be first in the report.rank array
        // and the lowest price to be last
        let buy  = report.rank[report.rank.length-1]
        let sell = report.rank[0]

//        console.log(buy)

        let buyFees = (() => {
            let fees = this.exchanges[buy.market].feeStructure()
            return {
                exchange:      buy.market,
                basePrice:     buy.price,
                feePercent:    fees.tradingFee,
                feeCalculated: ( (  fees.tradingFee / buy.price ) * 100 ),
                totalPrice:    ( ( ( fees.tradingFee / buy.price ) * 100 ) + buy.price )
            }
        })()

        let sellFees = (() => {
            let fees = this.exchanges[sell.market].feeStructure()
            return {
                exchange:      sell.market,
                basePrice:     sell.price,
                feePercent:    fees.tradingFee,
                feeCalculated: ( ( sell.price / fees.tradingFee ) * 100 ),
                totalPrice:    ( ( ( sell.price / fees.tradingFee ) * 100 ) - sell.price )
            }
        })()

        console.log(buyFees, sellFees)

        return {
            buy:          buyFees,
            sell:         sellFees,
            profitLoss:   ( buyFees.totalPrice - sellFees.totalPrice ),
            thresholdMet: ( ( buyFees.totalPrice - sellFees.totalPrice ) > 5 )
        }

    }

}

export let arbitrage = new Arbitrage()
