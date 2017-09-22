import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'

import { reportStructure, opportunityStructure } from './interfaces'


class Arbitrage {


    // Checks a report for an opporunity
    identifyOpportunity( report: reportStructure ): Observable<any>{
        return Observable.create( ( observer: Observer<opportunityStructure> ) => {
            observer.next({
                found:  ( Math.abs(report.spread) > 4 ), // Make sure the number is always positive // Get this value from tweakable settings
                spread: report.spread
            })
        })
    }



}

export let arbitrage = new Arbitrage()
