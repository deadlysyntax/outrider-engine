import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import { ExchangeClass, pluginStructure, currencyStructure, reportStructure } from './interfaces'

class MarketWatcher {

    markets:    Array<ExchangeClass>
    plugins:    Array<pluginStructure>
    currencies: currencyStructure



    constructor(  markets: Array<ExchangeClass>, currencies: currencyStructure, plugins: Array<pluginStructure> ){
        this.markets    = markets
        this.plugins    = plugins
        this.currencies = currencies
    }




    compileReport(): Observable<reportStructure> {
        return Observable.create( ( observer: Observer<reportStructure> ) => {
            // Get all the data from all the registered exchanges and combine into
            // one useful data structure
            let marketSummaries     = Observable.forkJoin(
                ...this.markets.map( market => market.getMarketSummary( this.currencies ) )
            )
            let currencies = this.currencies
            // We need to pre-process the data into a useful report
            // Pre-processing plugins are specfied in the
            marketSummaries.subscribe(
                market => {
                    // Each plugin can modify the report object.
                    // We build this object up, getting and formulating all the
                    // data needed to make decisions.
                    let reportData = this.plugins.reduce( ( report, plugin ) => {
                        return plugin.method( market, report, currencies )
                    }, {
                        rank:  [],
                        spread: 0,
                        currencies: {
                            base:   '',
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
                    })
                    // Send the compiled data back to the watcher
                    observer.next(reportData)
                },
                error => {
                    observer.error( error )
                }
            )
        })
    }
}



export default MarketWatcher
