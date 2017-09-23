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


    calculate( report: reportStructure ): arbitrageCalculationStructure {
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
                feeCalculated: ( (  buy.price / 100 ) * fees.tradingFee ),
                totalPrice:    ( ( (  buy.price / 100 ) * fees.tradingFee ) + buy.price )
            }
        })()

        let sellFees = (() => {
            let fees = this.exchanges[sell.market].feeStructure()
            return {
                exchange:      sell.market,
                basePrice:     sell.price,
                feePercent:    fees.tradingFee,
                feeCalculated: ( ( sell.price / 100 ) * fees.tradingFee ),
                totalPrice:    sell.price - ( ( ( sell.price / 100 ) * fees.tradingFee ) )
            }
        })()

        return {
            buy:          buyFees,
            sell:         sellFees,
            profitLoss:   ( buyFees.totalPrice - sellFees.totalPrice ),
            thresholdMet: ( ( buyFees.totalPrice - sellFees.totalPrice ) > config.profitThreshholdPercent ) // Spread threshhold? negative profit/loss?
        }

    }

}

export let arbitrage = new Arbitrage()
