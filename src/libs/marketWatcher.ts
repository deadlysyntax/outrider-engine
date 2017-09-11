import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

class MarketWatcher {

    markets: Array<any>


    setMarkets(markets: Array<any>): any {
        this.markets = markets

        return this
    }



    watch( markets: Array<any> ): void{

        console.log('Watching', this.markets )

        let marketSummaries     = Observable.forkJoin(
            ...this.markets.map( market => market.getMarketSummary() )
        )

        const subscribe = marketSummaries.subscribe(
            market => {

                // Analyze market results
                console.log( market, 'market')

            },
            error => {
                console.log(error)
            }
        )
    }
}



export let marketWatcher = new MarketWatcher()
