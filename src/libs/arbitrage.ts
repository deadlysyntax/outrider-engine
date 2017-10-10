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
                basePrice:     buy.askPrice,
                feePercent:    fees.tradingFee,
                feeCalculated: ( (  buy.askPrice / 100 ) * fees.tradingFee ),
                totalPrice:    ( ( (  buy.askPrice / 100 ) * fees.tradingFee ) + buy.askPrice )
            }
        })()

        let sellFees = (() => {
            let fees = this.exchanges[sell.market].feeStructure()
            return {
                exchange:      sell.market,
                basePrice:     sell.bidPrice,
                feePercent:    fees.tradingFee,
                feeCalculated: ( ( sell.bidPrice / 100 ) * fees.tradingFee ),
                totalPrice:    ( sell.bidPrice - ( ( ( sell.bidPrice / 100 ) * fees.tradingFee ) ) )
            }
        })()

        let arbitrageReport = {
            buy:         buyFees,
            sell:        sellFees,
            rebaseFee:   {
                cryptoFee:        0,
                convertedFiatFee: 0
            },
            profitLoss:        0,
            profitLossPercent: 0,
            thresholdMet:      false
        }
        // We need the fees calculated above so we need to reference it out here
        arbitrageReport.rebaseFee.cryptoFee = (() => {
            let fees = this.exchanges[buy.market].feeStructure()
            // Fee to transfer the purchased coin from the buying to the selling exchange in bitcoin
            return fees[report.currencies.base+'Withdrawl']
        })()
        arbitrageReport.rebaseFee.convertedFiatFee = (() => {
            // Convert coin into 'against' currency
            return ( buy.price * arbitrageReport.rebaseFee.cryptoFee )
        })()
        arbitrageReport.profitLoss        = ( sellFees.totalPrice - buyFees.totalPrice - arbitrageReport.rebaseFee.convertedFiatFee )
        arbitrageReport.thresholdMet      = ( arbitrageReport.profitLoss > config.profitThreshold )
        arbitrageReport.profitLossPercent = ( ( arbitrageReport.profitLoss / buy.askPrice ) * 100 )
        return arbitrageReport
    }

}

export let arbitrage = new Arbitrage()
