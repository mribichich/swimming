// 'use strict';

// import * as _ from 'underscore';

// import { ITournamentService } from 'app/services';
// import { IHistoryService } from 'app/services/historyService';
// import { Tournament, TournamentEvent, Swimmer } from 'app/entities';
// import { CategoryType } from 'app/enums/categoryType';
// import { CategoryFactory, SwimmerFactory } from 'app/factories';
// import { Feedback } from 'app/libs/feedback/feedback';

// /*@ngInject*/
// class Events {
//     constructor(
//         private $window,
//         private tournamentService: ITournamentService,
//         private $location: ng.ILocationService,
//         private $rootRouter,
//         private $mdDialog
//     ) {
//     }

//     fromRoute;
//     tournament: Tournament;

//     feedbacks = {
//         autoAssignSwimmers: new Feedback()
//     };

//     $routerOnActivate(toRoute, fromRoute) {
//         this.fromRoute = fromRoute;

//         this.getTournament(toRoute.params.tournamentId)
//             .then(() => this.getEventsCategories());
//     }

//     goBack() {
//         // this.$location.path(this.fromRoute.urlPath);
//         this.$rootRouter.navigate(['/TournamentDetails', { id: this.tournament.id }]);
//     }

//     navigateTo(to) {
//         this.$rootRouter.navigate(to);
//     }

//     getTournament(id: string): ng.IPromise<void> {
//         return this.tournamentService.get(id)
//             .then((tournament) => {
//                 this.tournament = tournament;
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     getEventsCategories() {
//         this.tournament.events.forEach(event => {
//             let categoryDb = _.find(this.tournament.categories, (category) => {
//                 return category.id === event.categoryId;
//             });

//             event.category = CategoryFactory.Create(categoryDb);
//         });
//     }

//     autoAssignSwimmers() {
//         this.tournamentService.autoAssignSwimmersToEvents(this.tournament.id)
//             .then(() => this.feedbacks.autoAssignSwimmers.setSuccess('Asignacion terminada exitosamente'));
//     }

//     deleteEvent(ev, tournamentEvent:TournamentEvent) {
//         var confirm = this.$mdDialog.confirm()
//             .parent(angular.element(document.body))
//             .title('Eliminado de Prueba')
//             .content('Esta seguro que desea eliminar la prueba: ' + tournamentEvent.number)
//             .ariaLabel('Eliminar Prueba')
//             .ok('Eliminar Prueba')
//             .cancel('Cancelar')
//             .targetEvent(ev);
//         this.$mdDialog.show(confirm).then(() => {
//             this.tournamentService.deleteEvent(this.tournament.id, tournamentEvent.id)
//                 .then(() => {
//                     // this.$location.path(`/tournaments/${this.tournament.id}/events`);
//                     // this.goBack();
//                 })
//                 .catch((error) => {
//                     console.log(error);

//                     this.$mdDialog.show(
//                         this.$mdDialog.alert()
//                             .parent(angular.element(document.body))
//                             .clickOutsideToClose(true)
//                             .title('Eliminado de Prueba')
//                             .textContent('No ha sido posible eliminar la prueba. Ha ocurrido un error inesperado.')
//                             .ariaLabel('Error eliminando la prueba')
//                             .ok('Ok')
//                             .targetEvent(ev)
//                     );
//                 });
//         }, () => {
//             //
//         });
//     }
// }

// export let events = {
//     templateUrl: 'app/components/events/events.html',
//     controller: Events
// };