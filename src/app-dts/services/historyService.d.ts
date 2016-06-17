export interface QueryParam {
    key: string;
    value: string;
}
export interface IHistoryService {
    go(path: string): void;
    back(params?: QueryParam[]): string;
    foward(): string;
}
export declare class HistoryService implements IHistoryService {
    private $location;
    private $rootScope;
    'use strict': any;
    constructor($location: any, $rootScope: any);
    isMoving: boolean;
    currentIndex: number;
    paths: string[];
    go(path: string): void;
    back(params?: QueryParam[]): string;
    foward(): string;
}
