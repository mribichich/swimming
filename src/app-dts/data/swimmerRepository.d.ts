import { IStorage } from 'app/data';
import { Swimmer } from 'app/entities';
export interface ISwimmerRepository {
    add(swimmer: Swimmer): ng.IPromise<void>;
    get(id: string): ng.IPromise<Swimmer>;
    find(query?: LokiQuery): ng.IPromise<Swimmer[]>;
    save(): ng.IPromise<void>;
}
export declare class SwimmerRepository implements ISwimmerRepository {
    private storage;
    private $q;
    constructor(storage: IStorage, $q: ng.IQService);
    collection: LokiCollection<Swimmer>;
    getCollection(): ng.IPromise<LokiCollection<Swimmer>>;
    add(swimmer: Swimmer): ng.IPromise<void>;
    get(id: string): ng.IPromise<Swimmer>;
    find(query?: LokiQuery): ng.IPromise<Swimmer[]>;
    save(): ng.IPromise<void>;
}
