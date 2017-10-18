import * as mongodb from 'mongodb'


//
// MongoDB Database connection.
//
let state = {
  db:   null,
  mode: null
}


export let connect = ( url: any , done: any ) => {
  if (state.db) return done()

  mongodb.MongoClient.connect( url, ( error: any, db: any ) => {
    if (error) return done(error)
    state.db = db
    done()
  })
}



export let get = () => {
  return state.db
}



export let close = ( done: any ) => {
  if (state.db) {
    state.db.close(( error: any, result: any ) => {
      state.db   = null
      state.mode = null
      done(error)
    })
  }
}
