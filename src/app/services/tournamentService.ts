import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';

import { ITournamentService, ISwimmerService, IGetAllInfo } from 'app/services';
import { TournamentGetAllFilter } from 'app/serviceFilters';
import { Tournament, Swimmer, TournamentEvent, Category, Heat } from 'app/entities';
import { TournamentFactory, CategoryFactory, SeedTimeFactory } from 'app/factories';
import { CategorySwimmerAssigner } from 'app/core/categorySwimmerAssigner';
import { EventGenderAssigner } from 'app/core/eventGenderAssigner';
import { ITournamentRepository } from 'app/data';
import { TournamentDb } from 'app/data/entities';

/*@ngInject*/
export class TournamentService implements ITournamentService {
    private tournamentsObserver: Observer<Tournament[]>;
    tournaments$: Observable<Tournament[]>;

    constructor(
        private $q: ng.IQService,
        private swimmerService: ISwimmerService,
        private tournamentRepository: ITournamentRepository
    ) {
        this.tournaments$ = new Observable(observer => this.tournamentsObserver = observer).share();
    }

    // openStore(callback: (store) => void) {
    //     this.$indexedDB.openStore('tournaments', callback);
    // }

    get(id: string, withEntities?: string[]) {
        var d = this.$q.defer<Tournament>();

        this.tournamentRepository.get(id)
            .then((result) => {
                var tournament = TournamentFactory.Create(result);

                let promises = [];

                if (withEntities) {
                    if (_.find(withEntities, entity => entity.toLowerCase() === 'swimmers')) {
                        promises.push(this.getTournamentSwimmers(tournament));
                    }
                }

                this.$q.all(promises)
                    .then(() => d.resolve(tournament));
            });

        return d.promise;
    }

    getAll(filter?: TournamentGetAllFilter, max?: number, skip?: number, sort: string = 'date', order: string = 'asc')
        : ng.IPromise<IGetAllInfo<Tournament>> {
        return this.tournamentRepository.find()
            .then((tournaments) => {
                var result = [];

                tournaments.forEach((tournamentDb) => {
                    var tournament = TournamentFactory.Create(tournamentDb);
                    result.push(tournament);
                });

                this.sort(tournaments, sort, order);

                return {
                    items: result,
                    totalCount: result.length,
                    filterCount: result.length
                };
            });
    }

    sort(tournaments: Tournament[], sort: string = 'date', order: string = 'asc') {
        if (!sort) {
            sort = 'name';
        }

        if (!order) {
            order = 'asc';
        }

        let orderVar = order === 'asc' ? 1 : -1;

        switch (sort) {
            case 'name':
                tournaments.sort((a: Tournament, b: Tournament) => {
                    return a.name.localeCompare(b.name) * orderVar;
                });
                break;

            case 'date':
            default:
                tournaments.sort((a: Tournament, b: Tournament) => {
                    if (a.startDateTime > b.startDateTime) {
                        return 1 * orderVar;
                    }
                    if (a.startDateTime < b.startDateTime) {
                        return -1 * orderVar;
                    }
                    // a must be equal to b
                    return 0;
                });
                break;
        }


    }

    create(tournament: Tournament) {
        return this.tournamentRepository.add(tournament)
            .then(() => this.tournamentRepository.save());
    }

    updateInfo(id: string, name: string, startDateTime: Date) {
        return this.tournamentRepository.get(id)
            .then((tournamentDb: TournamentDb) => {
                tournamentDb.name = name;
                tournamentDb.startDateTime = startDateTime;

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());

        // return this.tournamentRepository.update(tournament)
        //     .then(() => this.tournamentRepository.save());
    }

    addCategory(tournament: Tournament, category: Category) {
        // tournament.addCategory(category);

        return this.tournamentRepository.get(tournament.id)
            .then((tournamentDb: TournamentDb) => {
                tournamentDb.categories.push(category);

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    addEvent(id: string, event: TournamentEvent) {
        return this.tournamentRepository.get(id)
            .then((tournamentDb: TournamentDb) => {
                tournamentDb.events.push(event);

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    updateEvent(id: string, event: TournamentEvent) {
        return this.tournamentRepository.get(id)
            .then((tournamentDb: TournamentDb) => {
                let eventDb = tournamentDb.events.find(evt => evt.id === event.id);

                eventDb.number = event.number;
                eventDb.distance = event.distance;
                eventDb.style = event.style;
                eventDb.categoryId = event.categoryId;
                eventDb.genderType = event.genderType;

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    delete(id: string) {
        var deferred = this.$q.defer<void>();

        try {
            this.openStore((store) => {
                store.delete(id)
                    .then(() => {
                        deferred.resolve();
                    })
                    .catch((error) => {
                        console.error(error);
                        deferred.reject(error);
                    });
            });
        } catch (error) {
            console.error(error);
            deferred.reject(error);
        }

        return deferred.promise;
    }

    autoAssignSwimmersToEvents(tournamentId: string): ng.IPromise<void> {
        return this.get(tournamentId)
            .then((tournament) => this.getTournamentSwimmers(tournament))
            .then((tournament) => this.assignSwimmers(tournament))
            .then((tournament) => {
                this.tournamentRepository.get(tournamentId)
                    .then((tournamentDb: TournamentDb) => {
                        for (var i = 0; i < tournamentDb.events.length; i++) {
                            tournamentDb.events[i].swimmerIds = tournament.events[i].swimmerIds;
                        }

                        return tournamentDb;
                    })
                    .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
                    .then(() => this.tournamentRepository.save())
            });
    }

    getTournamentSwimmers(tournament: Tournament): ng.IPromise<Tournament> {
        if (!tournament.swimmerIds) {
            tournament.swimmers = [];
        }

        const defer = this.$q.defer<Tournament>();

        // if (tournament.swimmers && tournament.swimmerIds.length === tournament.swimmers.length) {
        //     defer.resolve();

        //     return defer.promise;
        // }

        let swimmersPromises: Array<ng.IPromise<Swimmer>> = [];
        tournament.swimmers = [];

        tournament.swimmerIds.forEach((swimmerId) => {
            let p = this.swimmerService.get(swimmerId);
            swimmersPromises.push(p);
        });

        this.$q.all(swimmersPromises)
            .then((swimmers: Array<Swimmer>) => {
                swimmers.forEach(swimmer => {
                    tournament.swimmers.push(swimmer);
                });

                defer.resolve(tournament);
            })
            .catch((error) => {
                console.log(error);

                defer.reject();
            });

        return defer.promise;
    }

    assignSwimmers(tournament: Tournament): Tournament {
        tournament.events.forEach((event) => {
            // event.swimmerIds = [];
            // event.swimmers = [];

            tournament.swimmers.forEach((swimmer) => {
                if (!EventGenderAssigner.isGender(event.genderType, swimmer.gender)) {
                    return;
                }

                if (!CategorySwimmerAssigner.isCategory(event.category, swimmer)) {
                    return;
                }

                event.addSwimmer(swimmer);
            });
        });

        return tournament;
    }

    getEvent(tournament: Tournament, id: string, withEntities?: string[]): ng.IPromise<TournamentEvent> {
        var deferred = this.$q.defer<TournamentEvent>();

        try {
            let tournamentEvent = _.find(tournament.events, (item) => {
                return item.id === id;
            });

            let category = _.find(tournament.categories, (category) => {
                return category.id === tournamentEvent.categoryId;
            });

            tournamentEvent.category = CategoryFactory.Create(category);

            tournamentEvent.swimmers = [];

            this.getTournamentSwimmers(tournament)
                .then(() => {
                    tournamentEvent.swimmerIds.forEach(swimmerId => {
                        let swimmer = _.find(tournament.swimmers, (item) => {
                            return item.id === swimmerId;
                        });

                        tournamentEvent.swimmers.push(swimmer);
                    });
                })
                .then(() => {
                    if (withEntities) {
                        if (_.find(withEntities, entity => entity.toLowerCase() === 'seedtimes')) {
                            if (!tournamentEvent.seedTimes || !tournamentEvent.seedTimes.length) {
                                let seedTimes = tournamentEvent.swimmers.map(swimmer => SeedTimeFactory.Create(swimmer));
                                tournamentEvent.seedTimes = seedTimes;
                                return;
                            }

                            let seedTimeIndexesToRemove: number[] = [];

                            for (let i = 0; i < tournamentEvent.seedTimes.length; i++) {
                                var seedTime = tournamentEvent.seedTimes[i];

                                let swimmer = _.find(tournamentEvent.swimmers, swimmer => swimmer.id === seedTime.swimmerId);

                                if (swimmer) {
                                    seedTime.swimmer = swimmer;
                                } else {
                                    seedTimeIndexesToRemove.push(i);
                                }
                            }

                            for (let i = seedTimeIndexesToRemove.length - 1; i >= 0; i--) {
                                tournamentEvent.seedTimes.splice(seedTimeIndexesToRemove[i], 1);
                            }

                            tournamentEvent.swimmers.forEach(swimmer => {
                                let seedTime = _.find(tournamentEvent.seedTimes, seedTime => seedTime.swimmerId === swimmer.id);

                                if (!seedTime) {
                                    let seedTime = SeedTimeFactory.Create(swimmer);

                                    tournamentEvent.seedTimes.push(seedTime);
                                }
                            });
                        }
                    }
                })
                .then(() => deferred.resolve(tournamentEvent));
        } catch (error) {
            console.error(error);
            throw error;
        }

        return deferred.promise;
    }

    getEvent2(tournamentId: string, eventId: string, withEntities?: string[]): ng.IPromise<TournamentEvent> {
        return this.get(tournamentId)
            .then((tournament: Tournament) => {
                return this.getEvent(tournament, eventId, withEntities);
            });
    }

    saveHeats(tournamentId, eventId, heats): ng.IPromise<void> {
        return this.tournamentRepository.get(tournamentId)
            .then((tournamentDb: TournamentDb) => {
                let eventDb = tournamentDb.events.find(evt => evt.id === eventId);

                eventDb.heats = heats;

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    updateSwimmers(tournamentId, swimmerIds): ng.IPromise<void> {
        return this.tournamentRepository.get(tournamentId)
            .then((tournamentDb: TournamentDb) => {
                tournamentDb.swimmerIds = swimmerIds;

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    startEvent(tournamentId: string, eventId: string): ng.IPromise<void> {
        return this.getEvent2(tournamentId, eventId)
            .then((tournamentEvent: TournamentEvent) => {
                tournamentEvent.startEvent();

                return tournamentEvent;
            })
            .then((tournamentEvent: TournamentEvent) => {
                this.tournamentRepository.get(tournamentId)
                    .then((tournamentDb: TournamentDb) => {
                        let eventDb = tournamentDb.events.find(evt => evt.id === eventId);

                        eventDb.startedDateTime = tournamentEvent.startedDateTime;
                        eventDb.state = tournamentEvent.state;

                        return tournamentDb;
                    })
                    .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
                    .then(() => this.tournamentRepository.save());
            });
    }

    stopEvent(tournamentId: string, eventId: string, eventHeats: Heat[]): ng.IPromise<void> {
        return this.getEvent2(tournamentId, eventId)
            .then((tournamentEvent: TournamentEvent) => {
                tournamentEvent.stopEvent(eventHeats);

                return tournamentEvent;
            })
            .then((tournamentEvent: TournamentEvent) => {
                this.tournamentRepository.get(tournamentId)
                    .then((tournamentDb: TournamentDb) => {
                        let eventDb = tournamentDb.events.find(evt => evt.id === eventId);

                        eventDb.finishedDateTime = tournamentEvent.finishedDateTime;
                        eventDb.state = tournamentEvent.state;

                        tournamentEvent.heats.forEach(heat => {
                            const heatDb = eventDb.heats.find(f => f.seriesNumber === heat.seriesNumber);
                            heat.lanes.forEach(lane => {
                                const laneDb = heatDb.lanes.find(f => f.number === lane.number);
                                laneDb.raceTime = lane.raceTime;
                            });
                        });

                        return tournamentDb;
                    })
                    .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
                    .then(() => this.tournamentRepository.save());
            });
    }

    changeEventTimes(tournamentId: string, eventId: string,  eventHeats: Heat[]): ng.IPromise<void>{
        return this.getEvent2(tournamentId, eventId)
            .then((tournamentEvent: TournamentEvent) => {
                tournamentEvent.changeTimes(eventHeats);

                return tournamentEvent;
            })
            .then((tournamentEvent: TournamentEvent) => {
                this.tournamentRepository.get(tournamentId)
                    .then((tournamentDb: TournamentDb) => {
                        let eventDb = tournamentDb.events.find(evt => evt.id === eventId);

                        eventDb.finishedDateTime = tournamentEvent.finishedDateTime;
                        eventDb.state = tournamentEvent.state;

                        tournamentEvent.heats.forEach(heat => {
                            const heatDb = eventDb.heats.find(f => f.seriesNumber === heat.seriesNumber);
                            heat.lanes.forEach(lane => {
                                const laneDb = heatDb.lanes.find(f => f.number === lane.number);
                                laneDb.raceTime = lane.raceTime;
                            });
                        });

                        return tournamentDb;
                    })
                    .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
                    .then(() => this.tournamentRepository.save());
            });
    }

    addSwimmersToEvent(tournamentId: string, eventId: string, selectedSwimmerIds: string[]): ng.IPromise<void> {
        return this.tournamentRepository.get(tournamentId)
            .then((tournamentDb: TournamentDb) => {
                let tournamentEventDb = tournamentDb.events.find(m => m.id === eventId);

                selectedSwimmerIds.forEach(selectedSwimmerId => {
                    if (tournamentEventDb.swimmerIds.every(m => m !== selectedSwimmerId)) {
                        tournamentEventDb.swimmerIds.push(selectedSwimmerId);
                    }
                });

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    registerSwimmers(tournamentId: string, newSwimmerIds: string[]): ng.IPromise<void> {
        return this.tournamentRepository.get(tournamentId)
            .then((tournamentDb: TournamentDb) => {
                newSwimmerIds.forEach(newSwimmerId => {
                    if (tournamentDb.swimmerIds.every(m => m !== newSwimmerId)) {
                        tournamentDb.swimmerIds.push(newSwimmerId);
                    }
                });

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    removeSwimmerFromEvent(tournamentId: string, eventId: string, swimmerToRemoveId: string): ng.IPromise<void> {
        return this.tournamentRepository.get(tournamentId)
            .then((tournamentDb: TournamentDb) => {
                let tournamentEventDb = tournamentDb.events.find(m => m.id === eventId);

                const swimmerToRemoveIndex = tournamentEventDb.swimmerIds.findIndex(m => m === swimmerToRemoveId);

                tournamentEventDb.swimmerIds.splice(swimmerToRemoveIndex, 1);

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    removeSwimmer(tournamentId: string, swimmerToRemoveId: string): ng.IPromise<void> {
        return this.tournamentRepository.get(tournamentId)
            .then((tournamentDb: TournamentDb) => {
                const swimmerToRemoveIndex = tournamentDb.swimmerIds.findIndex(m => m === swimmerToRemoveId);

                tournamentDb.swimmerIds.splice(swimmerToRemoveIndex, 1);

                tournamentDb.events.forEach(tournamentEventDb => {
                    const swimmerToRemoveIndex = tournamentEventDb.swimmerIds.findIndex(m => m === swimmerToRemoveId);

                    if (swimmerToRemoveIndex === -1) {
                        return;
                    }

                    tournamentEventDb.swimmerIds.splice(swimmerToRemoveIndex, 1);

                    if (tournamentEventDb.heats) {
                        for (var i = 0; i < tournamentEventDb.heats.length; i++) {
                            var heat = tournamentEventDb.heats[i];

                            const laneIndex = heat.lanes.findIndex(m => m.swimmerId === swimmerToRemoveId);

                            if (laneIndex === -1) {
                                continue;
                            }

                            heat.lanes.splice(laneIndex, 1);
                            break;
                        }
                    }

                    if (tournamentEventDb.seedTimes) {
                        const seedTimeIndex = tournamentEventDb.seedTimes.findIndex(m => m.swimmerId === swimmerToRemoveId);

                        if (seedTimeIndex === -1) {
                            return;
                        }

                        tournamentEventDb.seedTimes.splice(seedTimeIndex, 1);
                    }
                });

                return tournamentDb;
            })
            .then((tournamentDb) => this.tournamentRepository.update(tournamentDb))
            .then(() => this.tournamentRepository.save());
    }

    // load(id: any) {
    // this.get(id)
    // .then((tournament))

    // .subscribe(data => {
    //     let notFound = true;

    //     this._dataStore.todos.forEach((item, index) => {
    //         if (item.id === data.id) {
    //             this._dataStore.todos[index] = data;
    //             notFound = false;
    //         }
    //     });

    //     if (notFound) {
    //         this._dataStore.todos.push(data);
    //     }

    //     this._todosObserver.next(this._dataStore.todos);
    // }, error => console.log('Could not load todo.'));
    // }
}