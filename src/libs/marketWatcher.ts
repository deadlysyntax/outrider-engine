import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import { ExchangeClass, pluginStructure } from './interfaces'

class MarketWatcher {

    markets: Array<ExchangeClass>


    setMarkets( markets: Array<ExchangeClass> ): MarketWatcher {
        this.markets = markets
        return this
    }


    setMarketProcessorPlugins( plugins: Array<pluginStructure> ): MarketWatcher {
        this.plugins = plugins
        return this
    }



    watch(): void {
        console.log('Watching', this.markets )
        let marketSummaries     = Observable.forkJoin(
            ...this.markets.map( market => market.getMarketSummary() )
        )
        // Listen for a market summary which gathers market data from all the specified markets (currency exchange)
        const subscribe = marketSummaries.subscribe(
            market => {
                // Do this for each plugin
                this.plugins.forEach( plugin => {
                    // Run the plugin and pass it all the market data
                    plugin.method(market)
                })
            },
            error => {
                console.log(error)
            }
        )
    }
}



export let marketWatcher = new MarketWatcher()
