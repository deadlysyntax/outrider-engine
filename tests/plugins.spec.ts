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
      expect(report.spread).to.equal(0)
  })





  it('accurately calculates spread using bid/ask and reversed rank', () => {
      let report           = buildMarketReport(mock.configUseAskBid).method( mock.marketStructureHighToLow, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread = calculateSpread(mock.configUseAskBid).method( mock.marketStructureHighToLow, report, mock.currencyStructure )
      expect(report.spread).to.equal(0)
  })




  it('should calculate and identify arbitrage opportunities using last price', () => {
      let report              = buildMarketReport(mock.configUseLastPrice).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread    = calculateSpread(mock.configUseLastPrice).method( mock.marketStructureLowToHigh, report, mock.currencyStructure )
      let reportWithArbitrage = arbitrageIdentifier(mock.configUseLastPrice, { MarketOne, MarketTwo }).method( mock.marketStructureLowToHigh, reportWithSpread, mock.currencyStructure )
      expect(report.arbitrageCalculations.buy).to.deep.equal({
          exchange: 'MarketTwo',
          basePrice: 3500,
          feePercent: 0.85,
          feeCalculated: 29.75,
          totalPrice: 3529.75
      })
      expect( report.arbitrageCalculations.sell).to.deep.equal({
          exchange: 'MarketOne',
          basePrice: 4500,
          feePercent: 0.85,
          feeCalculated: 38.25,
          totalPrice: 4461.75
      })

  })


  it('should calculate and identify arbitrage opportunities using ask/bid', () => {
      let report              = buildMarketReport(mock.configUseAskBid).method( mock.marketStructureLowToHigh, defaults.reportStructure, mock.currencyStructure )
      let reportWithSpread    = calculateSpread(mock.configUseAskBid).method( mock.marketStructureLowToHigh, report, mock.currencyStructure )
      let reportWithArbitrage = arbitrageIdentifier(mock.configUseAskBid, { MarketOne, MarketTwo }).method( mock.marketStructureLowToHigh, reportWithSpread, mock.currencyStructure )
      console.log(reportWithArbitrage)
      /*
      expect(report.arbitrageCalculations.buy).to.deep.equal({
          exchange: 'MarketTwo',
          basePrice: 3500,
          feePercent: 0.85,
          feeCalculated: 29.75,
          totalPrice: 3529.75
      })
      expect( report.arbitrageCalculations.sell).to.deep.equal({
          exchange: 'MarketOne',
          basePrice: 4500,
          feePercent: 0.85,
          feeCalculated: 38.25,
          totalPrice: 4461.75
      })
      */

  })

})
