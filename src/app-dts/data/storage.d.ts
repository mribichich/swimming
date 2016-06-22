export interface IStorage {
    getCollection<T>(collectionName: string): ng.IPromise<LokiCollection<T>>;
    save(): ng.IPromise<void>;
}
export declare class Storage implements IStorage {
    private $q;
    constructor($q: any);
    db: Loki;
    loaded: any;
    fileExists(path: string): boolean;
    init(): any;
    getCollection<T>(collectionName: string): ng.IPromise<LokiCollection<T>>;
    save(): ng.IPromise<void>;
    applyVersions(): void;
}
