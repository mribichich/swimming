// import * as angular from 'angular';
// import * as _ from 'underscore';

// import { TournamentService } from 'app/services';
// import { IHistoryService, ISwimmerService } from 'app/services';
// import { Tournament, TournamentEvent, Swimmer, SeedTime, Heat, Lane } from 'app/entities';
// import { CategoryFactory, SwimmerFactory, SeedTimeFactory } from 'app/factories';
// import * as FeedbackLib from 'app/libs/feedbackLib';
// import { HeatAssigner } from 'app/core/heatAssigner';

// class EventSeed {
//     static $inject: string[] = [
//         'tournamentService',
//         '$rootRouter',
//         '$mdDialog',
//         'historyService',
//         'swimmerService',
//         '$window',
//         '$q'
//     ];

//     constructor(
//         private tournamentService: TournamentService,
//         private $rootRouter,
//         private $mdDialog,
//         private historyService: IHistoryService,
//         private swimmerService: ISwimmerService,
//         private $window,
//         private $q: ng.IQService
//     ) {
//     }

//     submitted: boolean;

//     feedbacks = {
//         save: new FeedbackLib.Feedback()
//     };

//     tournament: Tournament;
//     event: TournamentEvent;

//     $routerOnActivate(toRoute, fromRoute) {
//         this.getTournament(toRoute.params.tournamentId)
//             .then(() => this.getEvent(toRoute.params.eventId))
//             // .then(() => this.consolidateSeedTimes())
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     goBack() {
//         this.$rootRouter.navigate(['EventDetails', { tournamentId: this.tournament.id, eventId: this.event.id }]);
//     }

//     getTournament(id: string) {
//         return this.tournamentService.get(id, ['swimmers'])
//             .then((tournament) => {
//                 this.tournament = tournament;
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     getEvent(id: string) {
//        return this.tournamentService.getEvent(this.tournament, id, ['seedtimes'])
//             .then(tournamentEvent=> {
//                 this.event = tournamentEvent;
//             });

//         // this.event = _.find(this.tournament.events, (item) => {
//         //     return item.id === id;
//         // });

//         // let category = _.find(this.tournament.categories, (category) => {
//         //     return category.id === this.event.categoryId;
//         // });

//         // this.event.category = CategoryFactory.Create(category);

//         // let swimmersPromises: Array<ng.IPromise<Swimmer>> = [];
//         // this.event.swimmers = [];

//         // this.event.swimmerIds.forEach(swimmerId=> {
//         //     let p = this.swimmerService.get(swimmerId);
//         //     swimmersPromises.push(p);
//         // });

//         // return this.$q.all(swimmersPromises)
//         //     .then((swimmerDbs: Array<Swimmer>) => {
//         //         swimmerDbs.forEach(swimmerDb=> {
//         //             this.event.swimmers.push(SwimmerFactory.Create(swimmerDb));
//         //         });
//         //     });
//     }

//     // consolidateSeedTimes() {
//     //     if (!this.event.seedTimes || !this.event.seedTimes.length) {
//     //         let seedTimes = this.event.swimmers.map(swimmer => SeedTimeFactory.Create(swimmer));

//     //         this.event.seedTimes = seedTimes;

//     //         return;
//     //     }

//     //     let seedTimeIndexesToRemove: number[] = [];

//     //     for (let i = 0; i < this.event.seedTimes.length; i++) {
//     //         var seedTime = this.event.seedTimes[i];

//     //         let swimmer = _.find(this.event.swimmers, swimmer=> swimmer.id === seedTime.swimmerId);

//     //         if (swimmer) {
//     //             seedTime.swimmer = swimmer;
//     //         } else {
//     //             seedTimeIndexesToRemove.push(i);
//     //         }
//     //     }

//     //     for (let i = seedTimeIndexesToRemove.length - 1; i >= 0; i--) {
//     //         this.event.seedTimes.splice(seedTimeIndexesToRemove[i], 1);
//     //     }

//     //     this.event.swimmers.forEach(swimmer => {
//     //         let seedTime = _.find(this.event.seedTimes, seedTime=> seedTime.swimmerId === swimmer.id);

//     //         if (!seedTime) {
//     //             let seedTime = SeedTimeFactory.Create(swimmer);

//     //             this.event.seedTimes.push(seedTime);
//     //         }
//     //     });
//     // }

//     generateHeats(formInvalid: boolean) {
//         this.submitted = true;

//         if (formInvalid) {
//             return;
//         }

//         this.feedbacks.save.setNone();
//         this.feedbacks.save.isWorking = true;

//         let h = new HeatAssigner();
//         this.event.heats = h.assignSwimmers(this.event.seedTimes);

//         this.saveTimes();
//     }

//     saveTimes() {
//         this.tournamentService.saveHeats(this.tournament.id, this.event.id,  this.event.heats)
//             .then((data) => this.processSaveEvent(data))
//             .catch((error) => this.catchSaveEventError(error))
//             .finally(() => this.feedbacks.save.isWorking = false);
//     }

//     private processSaveEvent(data) {
//         this.feedbacks.save.setSuccess();
//         // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");
//         // this.$location.path(`/tournaments/${this.tournament.id}/events`);
//         // this.goBack();
//     }

//     private catchSaveEventError(error) {
//         console.error(error);
//         this.feedbacks.save.setError('Ha ocurrido un error guardando los datos');
//     }
// }

// export let eventSeed = {
//     templateUrl: 'app/components/eventSeed/eventSeed.html',
//     controller: EventSeed
// };
