import { IGetAllInfo } from 'app/services';
import { TournamentGetAllFilter } from 'app/serviceFilters';
import { Tournament, TournamentEvent } from 'app/entities';
export interface ITournamentService {
    get(id: string, withEntities?: string[]): ng.IPromise<Tournament>;
    getAll(filter?: TournamentGetAllFilter, max?: number, skip?: number, sort?: string, order?: string): ng.IPromise<IGetAllInfo<Tournament>>;
    create(t: Tournament): ng.IPromise<void>;
    edit(t: Tournament): ng.IPromise<void>;
    delete(id: string): ng.IPromise<void>;
    autoAssignSwimmersToEvents(tournament: Tournament): ng.IPromise<void>;
    getTournamentSwimmers(tournament: Tournament): ng.IPromise<void>;
    getEvent(tournament: Tournament, id: string, withEntities?: string[]): ng.IPromise<TournamentEvent>;
}
