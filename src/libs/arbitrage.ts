import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'


import { reportStructure, arbitrageCalculationStructure, tradeCalculationStructure, configStructure } from './interfaces'

import { btcMarkets as BTCMarkets } from '../exchanges/BTCMarkets'
import { independentReserve as IndependentReserve } from '../exchanges/independentReserve'


class Arbitrage {

    exchanges: any                = {}
    config:    configStructure

    constructor( exchanges: any, config: configStructure ) {
        // Proxy class to help us dynamically call these classes
        this.exchanges = exchanges
        this.config    = config
    }




    calculate( report: reportStructure ): arbitrageCalculationStructure {
        // We expect the highest bid to be first in the report.rank array
        // and the lowest price to be last
        let buy  = report.rank[report.rank.length-1]
        let sell = report.rank[0]

        let tradeRate = {
            buyPrice:  ( this.config.useLastTradePrice === true ? buy.lastPrice  : buy.askPrice ),
            sellPrice: ( this.config.useLastTradePrice === true ? sell.lastPrice : sell.bidPrice ),
        }

        let buyFees = (() => {
            let fees = this.exchanges[buy.market].feeStructure()
            return {
                exchange:      buy.market,
                basePrice:     tradeRate.buyPrice,
                feePercent:    fees.tradingFee,
                feeCalculated: ( (  tradeRate.buyPrice / 100 ) * fees.tradingFee ),
                totalPrice:    ( ( (  tradeRate.buyPrice / 100 ) * fees.tradingFee ) + tradeRate.buyPrice )
            }
        })()

        let sellFees = (() => {
            let fees = this.exchanges[sell.market].feeStructure()
            return {
                exchange:      sell.market,
                basePrice:     tradeRate.sellPrice,
                feePercent:    fees.tradingFee,
                feeCalculated: ( ( tradeRate.sellPrice / 100 ) * fees.tradingFee ),
                totalPrice:    ( tradeRate.sellPrice - ( ( ( tradeRate.sellPrice / 100 ) * fees.tradingFee ) ) )
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
            return ( tradeRate.buyPrice * arbitrageReport.rebaseFee.cryptoFee )
        })()
        arbitrageReport.profitLoss        = ( sellFees.totalPrice - buyFees.totalPrice - arbitrageReport.rebaseFee.convertedFiatFee )
        arbitrageReport.thresholdMet      = ( arbitrageReport.profitLoss > this.config.profitThreshold )
        arbitrageReport.profitLossPercent = ( ( arbitrageReport.profitLoss / tradeRate.buyPrice ) * 100 )
        return arbitrageReport
    }

}

export let arbitrage = Arbitrage
