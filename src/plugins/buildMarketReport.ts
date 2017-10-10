import { reportStructure, marketSummary, currencyStructure } from '../libs/interfaces'
import { arbitrage as Arbitrage } from '../libs/arbitrage'


export let buildMarketReport = () => {
    return {
        name:   'buildMarketReport',
        method: ( markets: Array<marketSummary>, report: reportStructure, currencies: currencyStructure ) => {
            //console.log(markets)
            // Rank the markets and
            report.rank = markets//.sort( ( a, b ) => {
            //    return a.lastPrice - a.lastPrice
            //})
            .map( market => {
                return {
                    price:    market.lastPrice,
                    bidPrice: market.bidPrice,
                    askPrice: market.askPrice,
                    market:   market.name
                }
            })
            // One final check to make sure we have the highrest priced bid at rank[0]
            // and the lowest bid at the end of the array
            //if( report.rank[0].price < report.rank[report.rank.length-1].price)
            //    report.rank.reverse()
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
            // We want to buy on one exchange cheaper than we can sell on another
            // When the buy price(bid) on one exchange is lower than the sell price(ask) on another, we have a spread


            // Calculate true spread where buy(bid) on one exchange is lower than the sell(ask) on another
            // If either of these equate to less than zero we've got our spread
            // well use the lowest one as our spread
            let interimSpread: number       = 0
            let interimRank:   Array<any>   = Array.from(report.rank)
            //
            //if( ( report.rank[report.rank.length-1].askPrice - report.rank[0].bidPrice ) < 0 ) {
                interimSpread  = ( report.rank[report.rank.length-1].askPrice - report.rank[0].bidPrice )
                //interimRank    = [report.rank[report.rank.length-1], report.rank[0] ]
            //}
            //
            if( (report.rank[0].askPrice - report.rank[report.rank.length-1].bidPrice ) < interimSpread ) {
                interimSpread = (report.rank[0].askPrice - report.rank[report.rank.length-1].bidPrice )
                interimRank   = [report.rank[0], report.rank[report.rank.length-1] ]
            }

            report.spread = interimSpread
            report.rank   = interimRank
            return report


            //console.log( interimSpread, interimRank )


            // calculate simplified version of 'spread' between exchanges
            // so just calculate the difference in bid price and make it a positive number
            // This is just so we cant tell if it's worth investigating further
            //report.spread = Math.abs( report.rank[0].price - report.rank[report.rank.length-1].price )

            //return report
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
