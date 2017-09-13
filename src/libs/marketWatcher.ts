import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import { ExchangeClass, pluginStructure, currencyStructure } from './interfaces'

class MarketWatcher {

    markets:    Array<ExchangeClass>
    plugins:    Array<pluginStructure>
    currencies: currencyStructure


    setMarkets( markets: Array<ExchangeClass> ): MarketWatcher {
        this.markets = markets
        return this
    }


    setMarketProcessorPlugins( plugins: Array<pluginStructure> ): MarketWatcher {
        this.plugins = plugins
        return this
    }


    setCurrencies( currencies: currencyStructure ): MarketWatcher {
        this.currencies = currencies
        return this
    }



    watch(): void {
        //console.log('Watching', this.markets )
        let marketSummaries     = Observable.forkJoin(
            ...this.markets.map( market => market.getMarketSummary( this.currencies ) )
        )
        // Listen for a market summary which gathers market data from all the specified markets (currency exchange)
        const subscribe = marketSummaries.subscribe(
            market => {
                // Each plugin set when this class was instantiated can manipulate this
                // data object. Data should be namespaced by the plugin so in a way
                // the data is immutable - data can't be overwritten or removed it can only be added
                let reportData = this.plugins.reduce( ( report, plugin ) => {
                    return plugin.method( market, report )
                }, {
                    rank:  [],
                    spread: 0
                })

                console.log(reportData, 'data')
            },
            error => {
                console.log(error)
            }
        )
    }
}



export let marketWatcher = new MarketWatcher()
