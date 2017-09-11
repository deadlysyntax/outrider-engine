import { Observable } from 'rxjs/Observable'

export interface marketSummary {
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
    feeStructure():                              feeStructure;
    getMarketData():                             Promise<any>;
    getMarketSummary():                          Observable<any>;
    marketSummaryFieldMapping(
        data: Array<any>
    ): marketSummary;
}
