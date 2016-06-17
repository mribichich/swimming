import { Heat, SeedTime } from 'app/entities';
export declare class HeatAssigner {
    'use strict': any;
    assignSwimmers(seedTimes: SeedTime[]): Heat[];
    calculateLanes(swimmersCount: number): number[];
}
