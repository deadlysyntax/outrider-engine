import { reportStructure } from '../libs/interfaces'


export let buildMarketReport = () => {
    return {
        name:   'buildMarketReport',
        method: ( markets: Array<any>, report: reportStructure ) => {
            // Rank the markets and
            report.rank = markets.sort( ( a, b ) => {
                return parseFloat(a.price) - parseFloat(b.price)
            })
            .map( market => {
                return {
                    price:  parseFloat(market.lastPrice),
                    market: market.name
                }
            })
            return report
        }
    }
}







export let calculateSpread = () => {
    return {
        name:   'buildMarketReport',
        method: ( markets: Array<any>, report: reportStructure ) => {
            // calculate simplified version of 'spread' between exchanges
            // so just calculate the difference in bid price
            report.spread = ( report.rank[0].price - report.rank[report.rank.length-1].price )
            return report
        }
    }
}
