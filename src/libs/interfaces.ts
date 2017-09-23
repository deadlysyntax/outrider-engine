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
    tradingFee:   any;
}




export interface currencyCodeStructure {
    [key:string]: string;
    bitcoin: string;
    ether:   string;
    aud:     string;
}





export interface ExchangeClass {
    baseURL:                          string;
    marketName:                       string;
    currencyCodes:                    currencyCodeStructure;
    feeStructure():                   feeStructure;
    getMarketData(
        currencies: currencyStructure
    ): Promise<any>;
    getMarketSummary(
        currencies: currencyStructure
    ):  Observable<any>;
    marketSummaryFieldMapping(
        data: Array<any>
    ): marketSummary;
}



export interface pluginStructure {
    name: string;
    method(
        market: Array<marketSummary>,
        report: reportStructure
    ): any;
}




export interface currencyStructure {
    base:    string;
    against: string;
}





export interface marketLastPriceStructure {
    price:  number;
    market: string;
}



export interface tradeCalculationStructure {
    exchange:      any; // This should become an exchange class
    basePrice:     number;
    feePercent:    number;
    feeCalculated: number;
    totalPrice:    number;
}



export interface arbitrageCalculationStructure {
    buy:          tradeCalculationStructure;
    sell:         tradeCalculationStructure;
    profitLoss:   number;
    thresholdMet: boolean;
}


export interface reportStructure {
    rank:                  Array<marketLastPriceStructure>;
    spread:                number;
    arbitrageCalculations: arbitrageCalculationStructure;
}
