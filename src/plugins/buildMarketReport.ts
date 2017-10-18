import { reportStructure, marketSummary, currencyStructure, configStructure } from '../libs/interfaces'
import { arbitrage as Arbitrage } from '../libs/arbitrage'



//
// Adds market data to the report object and ranks them highest to lowest
//
export let buildMarketReport = ( config: configStructure ) => {
    return {
        name:   'buildMarketReport',
        method: ( markets: Array<marketSummary>, report: reportStructure, currencies: currencyStructure ) => {
            // Rank the markets and add them to the report
            report.rank = markets.map( market => {
                return {
                    lastPrice:  market.lastPrice,
                    bidPrice:   market.bidPrice,
                    askPrice:   market.askPrice,
                    market:     market.name
                }
            })

            // Make sure we have the highrest priced bid at rank[0]
            // and the lowest bid at the end of the array
            if( config.useLastTradePrice === true ) {
                if( report.rank[0].lastPrice < report.rank[report.rank.length-1].lastPrice)
                    report.rank.reverse()
            }

            // This is if we are using the bid/ask orderbook prices instead of the last trade price
            if( config.useLastTradePrice !== true ) {
                if( report.rank[report.rank.length-1].bidPrice - report.rank[0].askPrice > report.rank[0].bidPrice - report.rank[report.rank.length-1].askPrice )
                    report.rank.reverse()
            }

            // Set currencies
            report.currencies = {
                base:    currencies.base,
                against: currencies.against
            }
            //
            return report
        }
    }
}









//
// Adds the spread
//
// We want to buy on one exchange cheaper than we can sell on another
// When the buy price(bid) on one exchange is lower than the sell price(ask) on another, we have a spread
// We can also use a simplified calculation that uses last trade price - assuming that a trade can be made
// at the last price instead of going off the order book
export let calculateSpread = ( config: configStructure ) => {
    return {
        name:   'buildMarketReport',
        method: ( markets: Array<any>, report: reportStructure, currencies: currencyStructure ) => {
            // Calculate true spread where buy(bid) on one exchange is lower than the sell(ask) on another
            // If either of these equate to less than zero we've got our spread
            // well use the lowest one as our spread
            if( config.useLastTradePrice !== true ) {
                report.spread =  Math.abs( report.rank[0].bidPrice - report.rank[report.rank.length-1].askPrice )
                return report
            }
            else {
                // calculate simplified version of 'spread' between exchanges
                // so just calculate the difference in bid price and make it a positive number
                // This is just so we cant tell if it's worth investigating further
                report.spread = Math.abs( report.rank[0].lastPrice - report.rank[report.rank.length-1].lastPrice )
                return report
            }

        }
    }
}










export let arbitrageIdentifier = ( config: configStructure, exchanges: any ) => {
    return {
        name:   'arbitrageIdentifier',
        method: ( markets: Array<any>, report: reportStructure, currencies: currencyStructure ) => {
            // This will do all our calculations for arbitrage
            report.arbitrageCalculations = new Arbitrage(exchanges, config).calculate(report)
            return report
        }
    }
}









export let addTimestamp = ( config: configStructure ) => {
    return {
        name: 'addTimestamp',
        method: ( markets: Array<any>, report: reportStructure, currencies: currencyStructure ) => {
            // Just to date our completed report
            report.timestamp = Date.now()
            report._id       = report.timestamp
            return report
        }
    }
}
