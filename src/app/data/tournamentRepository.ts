import { IStorage } from 'app/data';
import { TournamentDb } from 'app/data/entities';

export class TournamentRepository {
  /*@ngInject*/
  constructor(
    private storage: IStorage,
    private $q: ng.IQService
  ) {
  }

  collection: LokiCollection<TournamentDb>;

  getCollection(): ng.IPromise<LokiCollection<TournamentDb>> {
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

  add(tournament: TournamentDb): ng.IPromise<void> {
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

  get(id: string): ng.IPromise<TournamentDb> {
    return this.getCollection()
      .then(() => {
        return this.collection.by('id', id);
      });
  }

  delete(id: string): ng.IPromise<void> {
    return this.getCollection()
      .then(() => {
        let doc = this.collection.by('id', id);

        this.collection.remove(doc);
      });
  }

  find(query?: LokiQuery): ng.IPromise<TournamentDb[]> {
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
