import _ = require('underscore');

import { ITournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament } from 'app/entities/tournament';
import { Category } from 'app/entities/category';

/*@ngInject*/
class CategoryDetails {
    constructor(
        private tournamentService: ITournamentService,
        private $mdDialog,
        private $window,
        private historyService: IHistoryService,
        private $rootRouter
    ) {
    }

    tournament: Tournament;
    category: Category;

    $routerOnActivate(toRoute, fromRoute) {
        this.getTournament(toRoute.params.tournamentId)
            .then(() => this.getCategory(toRoute.params.categoryId));
    }

    goBack() {
        // this.$window.history.back();
        // this.$location.path(`/tournaments/${this.tournament.id}/categories`);
        //    this.$window.history.back();

        this.$rootRouter.navigate(['/TournamentDetails', { id: this.tournament.id }]);
    }

    getTournament(id: string) {
        return this.tournamentService.get(id)
            .then((tournament) => {
                this.tournament = tournament;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getCategory(id: string) {
        this.category = _.find(this.tournament.categories, (item) => {
            return item.id === id;
        });
    }

    delete($event) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Eliminar Categoria')
            .content('Esta seguro que desea eliminar la categoria: ' + this.category.name)
            .ariaLabel('Eliminar Categoria')
            .ok('Eliminar Categoria')
            .cancel('Cancelar')
            .targetEvent($event);
        this.$mdDialog.show(confirm).then(() => {
            var index = this.tournament.categories.indexOf(this.category);
            this.tournament.categories.splice(index, 1);

            this.tournamentService.edit(this.tournament)
                .then(() => {
                    // this.$location.path(`/tournaments/${this.tournament.id}/categories`);
                    this.goBack();
                })
                .catch((error) => {
                    console.log(error);
                });
        }, () => {
            //
        });
    }
}

export let categoryDetails = {
    templateUrl: 'app/components/categoryDetails/categoryDetails.html',
    controller: CategoryDetails
};