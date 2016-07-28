'use strict';

import { IService } from 'app/services/IService';
import { Swimmer } from 'app/entities';
import { SwimmerFactory } from 'app/factories';
import { ISwimmerRepository } from 'app/data';
import { Gender } from 'app/enums/gender';
import { SwimmerDb } from 'app/data/entities';

export interface ISwimmerService {
    get(id: string, withEntities?: string[]): ng.IPromise<Swimmer>;

    getAll(): ng.IPromise<Swimmer[]>;

    create(swimmer: Swimmer): ng.IPromise<void>;

    updateInfo(id: string, swimmer: Swimmer): ng.IPromise<void>;
}

/*@ngInject*/
export class SwimmerService implements ISwimmerService {
    constructor(
        private $q: ng.IQService,
        private swimmerRepository: ISwimmerRepository
    ) {
    }

    get(id: string, withEntities?: string[]): ng.IPromise<Swimmer> {
        // var d = this.$q.defer<Swimmer>();

        return this.swimmerRepository.get(id)
            .then((result) => {
                var swimmer = SwimmerFactory.Create(result);
                return swimmer;
                // d.resolve(swimmer);
            });

        // return d.promise;
    }

    getAll() {
        return this.swimmerRepository.find()
            .then((swimmerDbs) => {
                var result = [];

                swimmerDbs.forEach((swimmerDb) => {
                    var swimmer = SwimmerFactory.Create(swimmerDb);
                    result.push(swimmer);
                });

                result.sort((a: Swimmer, b: Swimmer) => {
                    return a.fullName.localeCompare(b.fullName);
                });

                return result;

                // return {
                //     items: result,
                //     totalCount: result.length,
                //     filterCount: result.length
                // };
            });

        // var deferred = this.$q.defer<Array<Swimmer>>();

        // try {
        //     this.$indexedDB.openStore('swimmers', (store) => {
        //         store.getAll().then((result) => {
        //             var swimmers = [];

        //             result.forEach((swimmerDb) => {
        //                 var swimmer = SwimmerFactory.Create(swimmerDb);
        //                 swimmers.push(swimmer);
        //             });

        //             swimmers.sort((a: Swimmer, b: Swimmer) => {
        //                 return a.fullName.localeCompare(b.fullName);
        //             });

        //             deferred.resolve(swimmers);
        //         });
        //     });
        // } catch (error) {
        //     console.error(error);
        //     throw error;
        // }

        // return deferred.promise;
    }

    create(swimmer: Swimmer): ng.IPromise<void> {
        return this.swimmerRepository.add(swimmer)
            .then(() => this.swimmerRepository.save());

        // var deferred = this.$q.defer<void>();

        // try {
        //     this.$indexedDB.openStore('swimmers', (store) => {
        //         store.insert(swimmer).then((result) => {
        //             deferred.resolve();
        //         });
        //     });
        // } catch (error) {
        //     console.error(error);
        //     deferred.reject(error);
        // }

        // return deferred.promise;
    }

    updateInfo(id: string, swimmer: Swimmer): ng.IPromise<void> {
        return this.swimmerRepository.get(id)
            .then((swimmerDb: SwimmerDb) => {
                swimmerDb.firstName = swimmer.firstName;
                swimmerDb.lastName = swimmer.lastName;
                swimmerDb.birthDate = swimmer.birthDate;
                swimmerDb.nid = swimmer.nid;
                swimmerDb.gender = swimmer.gender;
                swimmerDb.city = swimmer.city;
                swimmerDb.team = swimmer.team;

                return swimmerDb;
            })
            .then((swimmerDb) => this.swimmerRepository.update(swimmerDb))
            .then(() => this.swimmerRepository.save());

        // var deferred = this.$q.defer<void>();

        // try {
        //     this.$indexedDB.openStore('swimmers', (store) => {
        //         store.upsert(swimmer).then((result) => {
        //             deferred.resolve();
        //         });
        //     });
        // } catch (error) {
        //     console.error(error);
        //     deferred.reject(error);
        // }

        // return deferred.promise;
    }

    delete(id: string) {
        var deferred = this.$q.defer<void>();

        try {
            this.$indexedDB.openStore('swimmers', (store) => {
                store.delete(id).then(() => {
                    deferred.resolve();
                });
            });
        } catch (error) {
            console.error(error);
            deferred.reject(error);
        }

        return deferred.promise;
    }
}

// servicesModule.service('swimmerService', SwimmerService);