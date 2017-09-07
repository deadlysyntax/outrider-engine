import * as dotenv from 'dotenv'
import * as IR from 'independentreserve'
import * as CS from 'coinspot-api'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

// Grab configuration
dotenv.config()

let IRClient = new IR( process.env.IR_KEY,  process.env.IR_SECRET)
let CSClient = new CS( process.env.CS_KEY,  process.env.CS_SECRET)

let run = () => {
    //
    let ind = Observable.create( observer => {
        return IRClient.getMarketSummary("Xbt", "Aud", (error, response) => {
            console.log(response.CurrentLowestOfferPrice, 'IR')
            return observer.next(response.CurrentLowestOfferPrice)
        })
    })



    let coin = Observable.create( observer => {
        return CSClient.quotesell('BTC', '1', (error, response) => {
     	      console.log(JSON.parse(response).quote, 'CS')
              return observer.next(JSON.parse(response).quote)
        })
    })
    //console.log(typeof coin, 'coi')

    Observable.forkJoin([ind, coin]).subscribe(results => {
        console.log(results)


    })

    // Set this all to happen again in another spell
    setTimeout(run, 60000) // Reun this every minute

}
run()
