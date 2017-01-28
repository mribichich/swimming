import * as loki from 'lokijs';
import * as path from 'path';
import * as fs from 'fs';
import { Tournament, Swimmer } from 'app/entities';

export class Storage {
  db: Loki;
  loaded;

  /*@ngInject*/
  constructor(
    private $q
  ) {
  }

  checkFileExistence(fileName: string) {
    return this.fileExists(fileName)
      .catch((err: NodeJS.ErrnoException) => {
        if (err.code === 'ENOENT') {
          return this.checkDirectory(path.dirname(fileName))
            .then(() => this.createFile(fileName));
        }

        throw err;
      });
  }

  fileExists(fileName: string) {
    return new Promise((resolve, reject) => {
      fs.stat(fileName, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  createFile(fileName: string) {
    return new Promise((resolve, reject) => {
      fs.open(fileName, 'wx', (err, fd) => {
        if (err) {
          reject(err);
        }

        fs.close(fd, (err2) => {
          if (err2) {
            reject(err2);
          } else {
            resolve();
          }
        });
      });
    });
  }

  checkDirectory(directoryName: string) {
    return this.directoryExists(directoryName)
      .catch((err: NodeJS.ErrnoException) => {
        if (err.code === 'ENOENT') {
          return this.createDirectory(directoryName);
        }

        throw err;
      });
  }

  directoryExists(directoryName: string) {
    return new Promise((resolve, reject) => {
      fs.stat(directoryName, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  createDirectory(directoryName) {
    return new Promise((resolve, reject) => {
      fs.mkdir(directoryName, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  init() {
    const d = this.$q.defer();

    if (this.loaded) {
      d.resolve();
    } else {
      try {
        this.db = new loki(path.resolve(process.cwd(), 'data', 'app.db'));

        this.checkFileExistence(this.db.filename)
          .then(() => this.db.loadDatabase({},
            (error, data) => {
              if (error) {
                d.reject(error);
                return;
              }

              this.applyVersions();

              this.loaded = true;

              d.resolve();
            }))
          .catch(err => d.reject(err));
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
