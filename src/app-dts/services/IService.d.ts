export interface IService<T> {
    get(id: string, withEntities?: string[]): ng.IPromise<T>;
    getAll(): ng.IPromise<Array<T>>;
    create(t: T): ng.IPromise<void>;
    edit(t: T): ng.IPromise<void>;
    delete(id: string): ng.IPromise<void>;
}
