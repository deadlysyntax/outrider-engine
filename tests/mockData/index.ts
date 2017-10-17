
export let marketStructureHighToLow = [{
    name:      'MarketOne',
    dayHigh:   5000,
    dayLow:    4000,
    lastPrice: 4500,
    bidPrice:  4000,
    askPrice:  5000
}, {
    name:      'MarketTwo',
    dayHigh:   4000,
    dayLow:    3000,
    lastPrice: 3500,
    bidPrice:  3000,
    askPrice:  4000
}]




export let marketStructureLowToHigh = [
{
    name:      'MarketTwo',
    dayHigh:   4000,
    dayLow:    3000,
    lastPrice: 3500,
    bidPrice:  3000,
    askPrice:  4000
},
{
    name:      'MarketOne',
    dayHigh:   5000,
    dayLow:    4000,
    lastPrice: 4500,
    bidPrice:  4000,
    askPrice:  5000
}]




export let currencyStructure = {
    base:    'bitcoin',
    against: 'aud'
}




export let configUseLastPrice = {
    profitThreshold:   80,
    tradePercent:      .01,
    useLastTradePrice: true
}



export let configUseAskBid = {
    profitThreshold:   80,
    tradePercent:      .01,
    useLastTradePrice: false
}
