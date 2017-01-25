// app css
import * as styles from './category-list.component.css!css-modules';

// lib js
import * as angular from 'angular';

// app js
import { TournamentService } from 'app/services';
import { Tournament, Category } from 'app/entities';

class CategoryList {
    styles = styles;

    /*@ngInject*/
    constructor(
        private tournamentService: TournamentService,
        private $mdDialog,
        private $location: ng.ILocationService,
        private $window: ng.IWindowService,
        private $q: ng.IQService
    ) {
    }

    tournament: Tournament;

    onUpdate: Function;

    navigateTo(to) {
        this.$location.path(to);
    }

    delete(ev, category: Category) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Eliminado de Categoria')
            .content('Esta seguro que desea eliminar la categoria: ' + category.name)
            .ariaLabel('Eliminar Categoria')
            .ok('Eliminar Categoria')
            .cancel('Cancelar')
            .targetEvent(ev);
        this.$mdDialog.show(confirm).then(() => {
            this.tournamentService.deleteCategory(this.tournament.id, category.id)
                .then(() => {
                    this.onUpdate();
                })
                .catch((error) => {
                    console.log(error);

                    this.$mdDialog.show(
                        this.$mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Eliminado de Categoria')
                            .textContent('No ha sido posible eliminar la categoria. Ha ocurrido un error inesperado.')
                            .ariaLabel('Error eliminando la categoria')
                            .ok('Ok')
                            .targetEvent(ev)
                    );
                });
        }, () => {
            //
        });
    }
}

export let tournamentCategoryList: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/category-list.component.html',
    controller: CategoryList,
    bindings: {
        tournament: '=',
        onUpdate: '&'
    }
};
