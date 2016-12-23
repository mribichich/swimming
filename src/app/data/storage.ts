import loki from 'lokijs';
import * as path from 'path';
import * as fs from 'fs';
import { Tournament, Swimmer } from 'app/entities';

export interface IStorage {
    getCollection<T>(collectionName: string): ng.IPromise<LokiCollection<T>>

    // findAsync(): ng.IPromise<{}>

    save(): ng.IPromise<void>;
}

/*@ngInject*/
export class Storage implements IStorage {
    constructor(
        private $q
    ) {
    }

    db: Loki;
    loaded;

    fileExists(path: string) {
        try {
            fs.statSync(this.db.filename)

            return true;
        } catch (error) {
            if (error.code === "ENOENT") {
                return false;
            }

            throw error;
        }
    }

    init() {
        var d = this.$q.defer();

        if (this.loaded) {
            d.resolve();
        } else {
            try {
                this.db = new loki(path.resolve(__dirname, 'data', 'app.db'));

                if (this.fileExists(this.db.filename)) {
                    this.db.loadDatabase({}, (error, data) => {
                        if (error) {
                            d.reject(error);
                            return;
                        }

                        this.applyVersions();

                        this.loaded = true;

                        d.resolve();
                    });
                } else {
                    this.applyVersions();
                }
            } catch (error) {
                d.reject(error);
            }
        }

        return d.promise;
    }

    getCollection<T>(collectionName: string): ng.IPromise<LokiCollection<T>> {
        return this.init()
            .then(() => this.db.getCollection<T>(collectionName));
    }

    save(): ng.IPromise<void> {
        return this.init()
            .then(() => this.db.saveDatabase());
    }

    applyVersions() {
        // let currentVersion = 0;

        let dbVersionCollection = this.db.getCollection('dbVersion');
        let dbVersionData;

        if (!dbVersionCollection) {
            dbVersionCollection = this.db.addCollection('dbVersion');

            dbVersionData = dbVersionCollection.insert({ version: 1 });

            this.db.saveDatabase();
        } else {
            dbVersionData = dbVersionCollection.find()[0];
        }

        if (dbVersionData.version < 2) {
            this.db.addCollection<Tournament>('tournaments', {
                unique: ['id']
            });

            dbVersionData.version = 2;

            dbVersionCollection.update(dbVersionData);

            this.db.saveDatabase();
        }

        if (dbVersionData.version < 3) {
            this.db.addCollection<Tournament>('swimmers', {
                unique: ['id']
            });

            dbVersionData.version = 3;

            dbVersionCollection.update(dbVersionData);

            this.db.saveDatabase();
        }

        if (dbVersionData.version < 4) {
            this.db.addCollection<Swimmer>('swimmers', {
                unique: ['id']
            });

            dbVersionData.version = 4;

            dbVersionCollection.update(dbVersionData);

            this.db.saveDatabase();
        }

        // this.db.removeCollection('swimmers');

        // this.db.addCollection('swimmers', {
        //     unique: ['id']
        // });

        // this.db.saveDatabase();
    }
}