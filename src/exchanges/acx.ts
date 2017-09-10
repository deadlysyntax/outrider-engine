import * as request from 'request-promise'



class ACXModel {

    baseURL: string


    constructor(){
        this.baseURL = 'https://acx.io/api/v2'
    }



    getMarket(){
        let options = {
            uri: `${this.baseURL}/trades.json`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            qs: {
                market: 'ethaud'
            },
            json: true // Automatically parses the JSON string in the response
        };

        return request(options)
    }


}

export let ACX = new ACXModel()
