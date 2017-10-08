import { reportStructure } from './interfaces'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/catch'
import * as sql from 'sqlite3'





class Trader {

    report: reportStructure
    toTrade: boolean

    constructor( report: reportStructure ) {
        this.report  = report
        this.toTrade = this.tradeDecision()
        console.log('Initiatng Arbitrage Trade')
        return Observable.create( ( observer: any ) => {
            if( this.toTrade !== true )
                observer.error('Decided to not trade')
            // Place trade orders
            observer.complete()
        })

    }



    tradeDecision(): boolean {
        console.log('Checking funds across exchanges', this.report)

        let buy  = this.report.arbitrageCalculations.buy
        let sell = this.report.arbitrageCalculations.sell


        // Get wallet amount at each exchange


        return true
    }
}


export default Trader
