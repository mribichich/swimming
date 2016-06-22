import {IStorage} from 'app/data';
import {Swimmer} from 'app/entities';

export interface ISwimmerRepository {
    add(swimmerDb: Swimmer): ng.IPromise<void>;

    update(swimmerDb: Swimmer): ng.IPromise<void>;

    get(id: string): ng.IPromise<Swimmer>;

    find(query?: LokiQuery): ng.IPromise<Swimmer[]>;

    save(): ng.IPromise<void>;
}

/*@ngInject*/
export class SwimmerRepository implements ISwimmerRepository {
    constructor(
        private storage: IStorage,
        private $q: ng.IQService
    ) {
    }

    collection: LokiCollection<Swimmer>;

    getCollection(): ng.IPromise<LokiCollection<Swimmer>> {
        var d = this.$q.defer<LokiCollection<Swimmer>>();

        if (this.collection) {
            d.resolve();
        } else {
            this.storage.getCollection<Swimmer>('swimmers')
                .then((col) => {
                    this.collection = col;

                    d.resolve();
                });
        }

        return d.promise;
    }

    add(swimmerDb: Swimmer): ng.IPromise<void> {
        return this.getCollection()
            .then(() => {
                this.collection.insert(swimmerDb);
            });
    }

    update(swimmerDb: Swimmer): ng.IPromise<void> {
        return this.getCollection()
            .then(() => {
                this.collection.update(swimmerDb);
            });
    }

    get(id: string): ng.IPromise<Swimmer> {
        return this.getCollection()
            .then(() => {
                return this.collection.by('id', id);
            });
    }

    find(query?: LokiQuery): ng.IPromise<Swimmer[]> {
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