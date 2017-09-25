# outrider

This app contains 2 main parts Engine and Interface. Each part has it's own github repository.

Engine does 2 things, interacts with, monitors and runs automatic operations on the exchanges. This is our intelligence and analysis app.
`cd engine`

To develop:
`npm run watch`

To run:
`npm run start -b bitcoin.aud`

To serve api endppints
`npm run serve`

The Interface is an Ionic 2 app which calls the data found and stored by the engine.
`cd interface`
`ionic serve`
