import { ITournamentService, ISwimmerService, IGetAllInfo } from 'app/services';
import { TournamentGetAllFilter } from 'app/serviceFilters';
import { Tournament, TournamentEvent } from 'app/entities';
import { ITournamentRepository } from 'app/data';
export declare class TournamentService implements ITournamentService {
    private $q;
    private swimmerService;
    private tournamentRepository;
    constructor($q: ng.IQService, swimmerService: ISwimmerService, tournamentRepository: ITournamentRepository);
    get(id: string, withEntities?: string[]): ng.IPromise<Tournament>;
    getAll(filter?: TournamentGetAllFilter, max?: number, skip?: number, sort?: string, order?: string): ng.IPromise<IGetAllInfo<Tournament>>;
    sort(tournaments: Tournament[], sort?: string, order?: string): void;
    create(tournament: Tournament): ng.IPromise<void>;
    updateInfo(tournament: Tournament): void;
    delete(id: string): ng.IPromise<void>;
    autoAssignSwimmersToEvents(tournament: Tournament): ng.IPromise<void>;
    getTournamentSwimmers(tournament: Tournament): ng.IPromise<void>;
    assignSwimmers(tournament: Tournament): void;
    getEvent(tournament: Tournament, id: string, withEntities?: string[]): ng.IPromise<TournamentEvent>;
}
