import * as interfaces from '../../src/libs/interfaces'


export let reportStructure = {
    rank:  [],
    spread: 0,
    currencies: {
        base:    '',
        against: ''
    },
    arbitrageCalculations: {
        buy:          {
            exchange:      {},
            basePrice:     0,
            feePercent:    0,
            feeCalculated: 0,
            totalPrice:    0
        },
        sell:         {
            exchange:      {},
            basePrice:     0,
            feePercent:    0,
            feeCalculated: 0,
            totalPrice:    0
        },
        rebaseFee:    {
            cryptoFee:        0,
            convertedFiatFee: 0
        },
        profitLoss:        0,
        profitLossPercent: 0,
        thresholdMet:      false
    }
}
