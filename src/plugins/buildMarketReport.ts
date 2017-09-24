import { reportStructure, marketSummary, currencyStructure } from '../libs/interfaces'
import { arbitrage as Arbitrage } from '../libs/arbitrage'


export let buildMarketReport = () => {
    return {
        name:   'buildMarketReport',
        method: ( markets: Array<marketSummary>, report: reportStructure, currencies: currencyStructure ) => {
            // Rank the markets and
            report.rank = markets.sort( ( a, b ) => {
                return a.lastPrice - a.lastPrice
            })
            .map( market => {
                return {
                    price:  market.lastPrice,
                    market: market.name
                }
            })
            // One final check to make sure we have the highrest priced bid at rank[0]
            // and the lowest bid at the end of the array
            if( report.rank[0].price < report.rank[report.rank.length-1].price)
                report.rank.reverse()
            // Note currencies
            report.currencies = currencies
            return report
        }
    }
}






export let calculateSpread = () => {
    return {
        name:   'buildMarketReport',
        method: ( markets: Array<any>, report: reportStructure, currencies: currencyStructure ) => {
            // calculate simplified version of 'spread' between exchanges
            // so just calculate the difference in bid price and make it a positive number
            // This is just so we cant tell if it's worth investigating further
            report.spread = Math.abs( report.rank[0].price - report.rank[report.rank.length-1].price )
            return report
        }
    }
}







export let arbitrageIdentifier = () => {
    return {
        name:   'arbitrageIdentifier',
        method: ( markets: Array<any>, report: reportStructure, currencies: currencyStructure ) => {
            // This will do all our calculations for arbitrage
            report.arbitrageCalculations = Arbitrage.calculate(report)
            return report
        }
    }
}
