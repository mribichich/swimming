import {IStorage} from 'app/data';
import {Tournament} from 'app/entities';
import {TournamentDb} from 'app/data/entities';

export interface ITournamentRepository {
    add(tournament: TournamentDb): ng.IPromise<void>;

    update(tournamentDb: TournamentDb): ng.IPromise<void>;

    get(id: string): ng.IPromise<TournamentDb>;

    find(query?: LokiQuery): ng.IPromise<TournamentDb[]>;

    save(): ng.IPromise<void>;
}

export class TournamentRepository implements ITournamentRepository {
/*@ngInject*/
    constructor(
        private storage: IStorage,
        private $q: ng.IQService
    ) {
    }

    collection: LokiCollection<Tournament>;

    getCollection(): ng.IPromise<LokiCollection<Tournament>> {
        var d = this.$q.defer<LokiCollection<Tournament>>();

        if (this.collection) {
            d.resolve();
        } else {
            this.storage.getCollection<Tournament>('tournaments')
                .then((col) => {
                    this.collection = col;

                    d.resolve();
                });
        }

        return d.promise;
    }

    add(tournament: Tournament): ng.IPromise<void> {
        return this.getCollection()
            .then(() => {
                this.collection.insert(tournament);
            });
    }

    update(tournamentDb: TournamentDb): ng.IPromise<void> {
        return this.getCollection()
            .then(() => {
                this.collection.update(tournamentDb);
            });
    }

    get(id: string): ng.IPromise<Tournament> {
        return this.getCollection()
            .then(() => {
                return this.collection.by('id', id);
            });
    }

    find(query?: LokiQuery): ng.IPromise<Tournament[]> {
        return this.getCollection()
            .then(() => {
                if (query) {
                    return this.collection.find(query).data();
                }

                return this.collection.find();
            });
    }

    save(): ng.IPromise<void> {
        return this.storage.save();
    }
}