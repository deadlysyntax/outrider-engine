import { Observable } from 'rxjs/Observable'

export interface marketSummary {
    name:      string
    dayHigh:   number;
    dayLow:    number;
    lastPrice: number;
    bidPrice:  number;
    askPrice:  number;
}




export interface feeStructure {
    xbtWithdrawl: number;
    ethWithdrawl: number;
    audWithdrawl: any;
    makerFee:     any;
    takerFee:     any;
}




export interface ExchangeClass {
    baseURL:                                     string;
    marketName:                                  string;
    feeStructure():                              feeStructure;
    getMarketData():                             Promise<any>;
    getMarketSummary():                          Observable<any>;
    marketSummaryFieldMapping(
        data: Array<any>
    ): marketSummary;
}



export interface pluginStructure {
    name: string;
    method(): any;
}
