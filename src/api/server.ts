import * as express  from 'express'
import * as sql from 'sqlite3'
import * as path from 'path'
import * as cors from 'cors'

sql.verbose()

let app = express()

app.use(cors())

let db  = new sql.Database(path.resolve(__dirname, '../../db/outrider.sqlite'), sql.OPEN_READWRITE)

// Define routes

// TODO Add middleware for checking api key


app.get('/arbitrage/data', (req: any, res: any) => {
    //
    res.setHeader('Content-Type', 'application/json')
    //
    db.all(`SELECT * FROM arbitrage ORDER BY timestamp ASC LIMIT 1000`, (error: any, results: any) => {
        // Scoot if theres an error
        if( error )
            res.send(JSON.stringify('Error'))
        // Group the calls by hour and calculate the average
        res.send(JSON.stringify(results))
    })


})




// Start Serve
app.listen(9999, () => {
    console.log('Example app listening on port 9999')
})
