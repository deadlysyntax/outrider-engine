import * as express  from 'express'
import * as bodyParser from 'body-parser'
import * as sql from 'sqlite3'
import * as path from 'path'
import * as cors from 'cors'
import * as moment from 'moment-timezone'
//import * as tz from 'moment-timezone'

sql.verbose()

let app = express()

app.use(cors())
app.use(bodyParser.json())

let db  = new sql.Database(path.resolve(__dirname, '../../db/outrider.sqlite'), sql.OPEN_READWRITE)

// Define routes

// TODO Add middleware for checking api key

//
//
//
//
app.get('/arbitrage/data', (req: any, res: any) => {
    //
    res.setHeader('Content-Type', 'application/json')
    //
    db.all(`SELECT * FROM arbitrage ORDER BY timestamp DESC LIMIT 100000`, (error: any, results: any) => {
        // Scoot if theres an error
        if( error )
            res.send(JSON.stringify('Error'))

        // Group the calls by hour and calculate the average
        res.send(
            JSON.stringify(
                processArbitrageData(
                    results.filter( ( result: any ) => {
                        return JSON.parse(result.data).arbitrageCalculations.profitLoss > 0
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
    //
    db.all(`SELECT * FROM arbitrage ORDER BY timestamp DESC LIMIT 1`, (error: any, results: any) => {
        // Scoot if theres an error
        if( error )
            res.send(JSON.stringify('Error'))

        // Group the calls by hour and calculate the average
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
    let inAnHour = moment(req.body.time, 'YYYY-MM-DD HH').add(1, 'hours').format("YYYY-MM-DD HH")

    //
    db.all(`SELECT * FROM arbitrage WHERE timestamp BETWEEN '${req.body.time}' AND '${inAnHour}'`, (error: any, results: any) => {
        // Scoot if theres an error
        if( error )
            res.send(JSON.stringify('Error'))

        // Group the calls by hour and calculate the average
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
  let compiledData = dataSet.reduce( ( result: any, opportunity: any ) => {
    // Convert the data into js
    let data = JSON.parse(opportunity.data)
    // We use the date/time as our label
    let time = moment(opportunity.timestamp, 'YYYY-MM-DD H:mm:ss').tz('Australia/Sydney').format('YYYY-MM-DD HH')

    // Create a fresh one other wise we're manipulating the previous iteration of the reducer
    if ( ! result[time] ) result[time] = { time, high: data.arbitrageCalculations.profitLoss, low: data.arbitrageCalculations.profitLoss}  // Create new group, start the low at the first point
    // Add the high for this time span
    if( data.arbitrageCalculations.profitLoss > result[time].high )
      result[time].high = data.arbitrageCalculations.profitLoss

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
  let compiledData = dataSet.reduce( ( result: any, opportunity: any ) => {
    // Convert the data into js
    let data = JSON.parse(opportunity.data)
    // We use the date/time as our label
    let time = opportunity.timestamp //moment(opportunity.timestamp, 'YYYY-MM-DD H:mm:ss').tz('Australia/Sydney').format('YYYY-MM-DD HH')


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




// Start Serve
app.listen(9999, () => {
    console.log('Example app listening on port 9999')
})
