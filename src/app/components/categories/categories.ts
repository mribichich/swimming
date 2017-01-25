//  'use strict';

// import { TournamentService } from 'app/services';
// import { IHistoryService } from 'app/services/historyService';
// import { Tournament } from 'app/entities/tournament';
// import { Category } from 'app/entities/category';

// /*@ngInject*/
// class Categories {
//     constructor(
//         private tournamentService: TournamentService,
//         private $location: ng.ILocationService,
//         private $window,
//         private $rootRouter
//     ) {
//     }

//     fromRoute;
//     tournament: Tournament;

//     $routerOnActivate(toRoute, fromRoute) {
//         this.fromRoute = fromRoute;

//         this.getTournament(toRoute.params.tournamentId);
//     }

//     goBack() {
//         // this.$location.path(this.fromRoute.urlPath);
//         this.$rootRouter.navigate(['/TournamentDetails', { id: this.tournament.id }]);
//     }

//     navigateTo(to) {
//         // this.historyService.go(to);
//         this.$rootRouter.navigate(to);
//     }

//     getTournament(id: string) {
//         this.tournamentService.get(id)
//             .then((tournament) => {
//                 this.tournament = tournament;
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }
// }

// export let categories = {
//     templateUrl: 'app/components/categories/categories.html',
//     controller: Categories
// };
