import { Observable } from 'rxjs/Observable';

import { IGetAllInfo } from 'app/services';
import { TournamentGetAllFilter } from 'app/serviceFilters';
import { Tournament, TournamentEvent, Category, Heat } from 'app/entities';

export interface ITournamentService {
    tournaments$: Observable<Tournament[]>;

    get(id: string, withEntities?: string[]): ng.IPromise<Tournament>;

    getAll(filter?: TournamentGetAllFilter, max?: number, skip?: number, sort?: string, order?: string)
        : ng.IPromise<IGetAllInfo<Tournament>>;

    create(t: Tournament): ng.IPromise<void>;

    updateInfo(id: string, name: string, startDateTime: Date): ng.IPromise<void>;

    addCategory(tournament: Tournament, category: Category);

    addEvent(id: string, event: TournamentEvent);

    updateEvent(id: string, event: TournamentEvent);

    delete(id: string): ng.IPromise<void>;

    autoAssignSwimmersToEvents(tournamentId: string): ng.IPromise<void>;

    getTournamentSwimmers(tournament: Tournament): ng.IPromise<Tournament>;

    getEvent(tournament: Tournament, id: string, withEntities?: string[]): ng.IPromise<TournamentEvent>;

    getEvent2(tournamentId: string, eventId: string, withEntities?: string[]): ng.IPromise<TournamentEvent>;

    saveHeats(tournamentId, eventId, heats): ng.IPromise<void>;

    updateSwimmers(tournamentId, swimmerIds): ng.IPromise<void>;

    startEvent(tournamentId: string, eventId: string): ng.IPromise<void>;

    stopEvent(tournamentId: string, eventId: string, eventHeats: Heat[]): ng.IPromise<void>;

    changeEventTimes(tournamentId: string, eventId: string,  eventHeats: Heat[]): ng.IPromise<void>;

    addSwimmersToEvent(tournamentId: string, eventId: string, selectedSwimmerIds: string[]): ng.IPromise<void>;

    registerSwimmers(tournamentId: string, newSwimmerIds: string[]): ng.IPromise<void>;

    removeSwimmerFromEvent(tournamentId: string, eventId: string, swimmerToRemoveId: string): ng.IPromise<void>;

    removeSwimmer(tournamentId: string, swimmerToRemoveId: string): ng.IPromise<void>;
}