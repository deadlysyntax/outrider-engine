import { expect } from 'chai'
import 'mocha'


import * as mock from './mockData/index'

import * as defaults from '../src/libs/defaults'

import { buildMarketReport, calculateSpread, arbitrageIdentifier } from '../src/plugins/buildMarketReport'

import { marketOne as MarketOne } from './mockData/marketOne'
import { marketTwo as MarketTwo } from './mockData/marketTwo'


describe('Market Report Builder', () => {



  it('should add market data to rank', () => {
      let report = buildMarketReport(mock.configUseLastPrice).method( mock.marketStructureHighToLow, defaults.reportStructure, mock.currencyStructure )
      expect(report.rank.length).to.equal(2)
      expect(report.rank[0].lastPrice).to.equal(4500)
      expect(report.rank[1].lastPrice).to.equal(3500)

  })



  it('should rank exchanges highest to lowest if using last price', () => {
      let report = buildMarketReport(mock.configUseLastPrice).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      expect(report.rank.length).to.equal(2)
      expect(report.rank[0].lastPrice).to.equal(4500)
      expect(report.rank[1].lastPrice).to.equal(3500)
  })




  it('should rank exchanges highest to lowest if using ask/bid prices', () => {
      let report = buildMarketReport(mock.configUseAskBid).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      expect(report.rank.length).to.equal(2)
      expect(report.rank[0].lastPrice).to.equal(4500)
      expect(report.rank[1].lastPrice).to.equal(3500)
  })




  it('accurately calculates spread using last price', () => {
      let report           = buildMarketReport(mock.configUseLastPrice).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread = calculateSpread(mock.configUseLastPrice).method( mock.marketStructureLowToHigh, report, mock.currencyStructure )
      expect(report.spread).to.equal(1000)
  })






  it('accurately calculates spread using bid/ask', () => {
      let report           = buildMarketReport(mock.configUseAskBid).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread = calculateSpread(mock.configUseAskBid).method( mock.marketStructureLowToHigh, report, mock.currencyStructure )
      expect(report.spread).to.equal(50)
  })





  it('accurately calculates spread using bid/ask and reversed rank', () => {
      let report           = buildMarketReport(mock.configUseAskBid).method( mock.marketStructureHighToLow, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread = calculateSpread(mock.configUseAskBid).method( mock.marketStructureHighToLow, report, mock.currencyStructure )
      expect(report.spread).to.equal(50)
  })




  it('should calculate and identify arbitrage opportunities using last price', () => {
      let report              = buildMarketReport(mock.configUseLastPrice).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread    = calculateSpread(mock.configUseLastPrice).method( mock.marketStructureLowToHigh, report, mock.currencyStructure )
      let reportWithArbitrage = arbitrageIdentifier(mock.configUseLastPrice, { MarketOne, MarketTwo }).method( mock.marketStructureLowToHigh, reportWithSpread, mock.currencyStructure )
      expect(report.arbitrageCalculations).to.deep.equal({
          buy: {
              exchange: 'MarketTwo',
              basePrice: 3500,
              feePercent: 0.85,
              feeCalculated: 29.75,
              totalPrice: 3529.75
          },
          sell: {
              exchange: 'MarketOne',
              basePrice: 4500,
              feePercent: 0.85,
              feeCalculated: 38.25,
              totalPrice: 4461.75
          },
          rebaseFee: { cryptoFee: 0.0006, convertedFiatFee: 2.0999999999999996 },
          profitLoss: 929.9,
          profitLossPercent: 26.56857142857143,
          thresholdMet: true
      })
  })


  it('should calculate and identify arbitrage opportunities using ask/bid', () => {
      let report              = buildMarketReport(mock.configUseAskBid).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread    = calculateSpread(mock.configUseAskBid).method( mock.marketStructureLowToHigh, report, mock.currencyStructure )
      let reportWithArbitrage = arbitrageIdentifier(mock.configUseAskBid, { MarketOne, MarketTwo }).method( mock.marketStructureLowToHigh, reportWithSpread, mock.currencyStructure )

      expect(report.arbitrageCalculations).to.deep.equal({
          buy: {
              exchange: 'MarketTwo',
              basePrice: 4000,
              feePercent: 0.85,
              feeCalculated: 34,
              totalPrice: 4034
          },
          sell: {
              exchange: 'MarketOne',
              basePrice: 4050,
              feePercent: 0.85,
              feeCalculated: 34.425,
              totalPrice: 4015.575
          },
          rebaseFee: { cryptoFee: 0.0006, convertedFiatFee: 2.4 },
          profitLoss: -20.82500000000018,
          profitLossPercent: -0.5206250000000046,
          thresholdMet: false
      })
  })

})
