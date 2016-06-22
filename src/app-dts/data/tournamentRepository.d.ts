import { IStorage } from 'app/data';
import { Tournament } from 'app/entities';
export interface ITournamentRepository {
    add(tournament: Tournament): ng.IPromise<void>;
    get(id: string): ng.IPromise<Tournament>;
    find(query?: LokiQuery): ng.IPromise<Tournament[]>;
    save(): ng.IPromise<void>;
}
export declare class TournamentRepository implements ITournamentRepository {
    private storage;
    private $q;
    constructor(storage: IStorage, $q: ng.IQService);
    collection: LokiCollection<Tournament>;
    getCollection(): ng.IPromise<LokiCollection<Tournament>>;
    add(tournament: Tournament): ng.IPromise<void>;
    updateInfo(tournament: Tournament): ng.IPromise<void>;
    get(id: string): ng.IPromise<Tournament>;
    find(query?: LokiQuery): ng.IPromise<Tournament[]>;
    save(): ng.IPromise<void>;
}
