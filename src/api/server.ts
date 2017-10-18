import * as express  from 'express'
import * as bodyParser from 'body-parser'
//import * as sql from 'sqlite3'
import * as path from 'path'
import * as cors from 'cors'
import * as moment from 'moment-timezone'
//import * as tz from 'moment-timezone'
import * as mongodb from 'mongodb'
import * as db from './db'



let app = express()



app.use(cors())
app.use(bodyParser.json())




// TODO Add middleware for checking api key

//
app.get('/arbitrage/data', (req: any, res: any) => {
    //
    res.setHeader('Content-Type', 'application/json')

    let collection = db.get().collection('arbitrage')

    collection.find().sort({'timestamp': -1}).limit(10000).toArray( ( error: any, results: any ) => {
        if( error )
            res.send(JSON.stringify('Error'))

        // Group the calls by hour and calculate the average
        res.send(
            JSON.stringify(
                processArbitrageData(
                    results.filter( ( result: any ) => {
                        return ( result.arbitrageCalculations.profitLoss > 0 )
                    })
                )
            )
        )

    })
})




//
//
//
//
app.get('/arbitrage/latest', (req: any, res: any) => {
    //
    res.setHeader('Content-Type', 'application/json')

    let collection = db.get().collection('arbitrage')

    collection.find().sort({'timestamp': -1}).limit(1).toArray( ( error: any, results ) => {
        if( error )
            res.send(JSON.stringify('Error'))

        res.send(JSON.stringify(results))

    })
})




//
//
//
//
app.post('/arbitrage/hourly', (req: any, res: any) => {
    //
    res.setHeader('Content-Type', 'application/json')

    // Get a datetime string for an hour ahead of the supplied datetime
    let from     = moment(req.body.time, 'YYYY-MM-DD HH').valueOf()
    let inAnHour = moment(req.body.time, 'YYYY-MM-DD HH').add(1, 'hours').valueOf()

    let collection = db.get().collection('arbitrage')

    collection.find({
        timestamp: {
            $gte: from,
            $lt:  inAnHour
        }
    })
    .toArray( ( error: any, results ) => {
        if( error )
            res.send(JSON.stringify('Error'))

        res.send(JSON.stringify(processHourlyArbitrageData(results)))
    })

})





//
//
//
// Format the data in how we want our chart to recieve it
let processArbitrageData = (dataSet: any) => {

  let processedData = []

  if( typeof dataSet === 'undefined' || dataSet === null )
    return []
  //
  let compiledData = dataSet.reduce( ( result: any, data: any ) => {
    // We use the date/time as our label
    //let time = moment(Math.floor(data.timestamp/1000), 'YYYY-MM-DD H:mm:ss').tz('Australia/Sydney').format('YYYY-MM-DD HH')
    let time = moment(Math.floor(data.timestamp)).tz('Australia/Sydney').format('YYYY-MM-DD HH')
    // Create a fresh one other wise we're manipulating the previous iteration of the reducer
    if ( ! result[time] ) result[time] = { time, high: data.arbitrageCalculations.profitLoss, low: data.arbitrageCalculations.profitLoss}  // Create new group, start the low at the first point
    // Add the high for this time span
    if( data.arbitrageCalculations.profitLoss > result[time].high )
      result[time].high = data.arbitrageCalculations.profitLoss
      // And a low
    if( data.arbitrageCalculations.profitLoss < result[time].low )
      result[time].low = data.arbitrageCalculations.profitLoss
    return result
  }, {} )
  //
  for( let key in compiledData )
    processedData.push(compiledData[key])
  //
  return processedData

}




//
//
//
// Format the data in how we want our chart to recieve it
let processHourlyArbitrageData = (dataSet: any) => {
  let processedData = []

  if( typeof dataSet === 'undefined' || dataSet === null )
    return []
  //
  let compiledData = dataSet.reduce( ( result: any, data: any ) => {

    // We use the date/time as our label
    let time = data.timestamp //moment(opportunity.timestamp, 'YYYY-MM-DD H:mm:ss').tz('Australia/Sydney').format('YYYY-MM-DD HH')

    if ( ! result[time] ) result[time] = { time, data: [] }

    result[time].data.push(data)

    return result
  }, {} )
  //
  for( let key in compiledData )
    processedData.push(compiledData[key])
  //
  return processedData

}





// Connect to the daatabase and start the server
db.connect('mongodb://localhost:27017/outrider', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
      // Start Serve
      app.listen(9999, () => {
          console.log('Example app listening on port 9999')
      })
  }
})
