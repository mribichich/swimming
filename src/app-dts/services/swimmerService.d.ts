import { IService } from 'app/services/IService';
import { Swimmer } from 'app/entities';
import { ISwimmerRepository } from 'app/data';
export interface ISwimmerService extends IService<Swimmer> {
}
export declare class SwimmerService implements ISwimmerService {
    private $q;
    private swimmerRepository;
    constructor($q: ng.IQService, swimmerRepository: ISwimmerRepository);
    get(id: string): ng.IPromise<Swimmer>;
    getAll(): ng.IPromise<any[]>;
    create(swimmer: Swimmer): ng.IPromise<void>;
    edit(swimmer: Swimmer): ng.IPromise<void>;
    delete(id: string): ng.IPromise<void>;
}
