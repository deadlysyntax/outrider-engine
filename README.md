# outrider
This app contains 2 main parts Engine and Interface. Each part has it's own github repository.

This is the Engine repository and it does 2 things. The first is the automated trading bot, the second is it provides an API to our [interface](https://github.com/deadlysyntax/outrider-interface).

## Trading Bot
This part of the app monitors the markets, identifies arbitrage opportunities and implements trades.

## API
This provides access to our database of trading information, including providing charting data for the interface to display graphs.
***
### Installation:
Outrider Engine is standalone sofware and is controlled via the command line.

Download from github.
`git clone git@github.com:deadlysyntax/outrider-engine.git`

Move into the bot directory
`cd outrider-engine`

To develop:
`npm run watch`

To run:
`npm run start -b bitcoin/aud`

The `-b` flag signals the trading pairs you would like to monitor. Open a new shell and use a different pair if you'd like to trade different options.

To run live trades add the `trade` keyword to the command. Without this keyword, it will monitor the markets but not act on any opportunities it finds.
`npm run start -b bitcoin/aud trade`

To serve API endpoints
`npm run serve`

***
### Configuration
To configure trading thresholds and other global options, edit `src/config.ts` and recompile the app by running `tsc`.

To add your own exchange API keys, rename `.env.example` to just `.env` and add your keys to each option as provided by the sample.

***
The [interface](https://github.com/deadlysyntax/outrider-interface) is an Ionic app provides nice visualizations about the data stored by the engine.

***
Cryptocurrency trading is not for noobs. Please do your own research and understand what Cryptocurrency Arbitrage is before using this software. You use Outrider at your own risk. We take no responsibility for how this software is used or the results that come from using it.
