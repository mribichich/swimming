
import * as angular from 'angular';

import { ITournamentService } from 'app/services';
import { Tournament, TournamentEvent, Swimmer } from 'app/entities';
import { Feedback } from 'app/libs/feedback/feedback';

class TournamentEvents {
    /*@ngInject*/
    constructor(
        private $mdDialog,
        private tournamentService: ITournamentService,
        private $location: ng.ILocationService,
    ) { }

    tournament: Tournament;

    onUpdate: Function;

    feedbacks = {
        autoAssignSwimmers: new Feedback()
    };

    navigateTo(to) {
        this.$location.path(to);
    }

    autoAssignSwimmers(ev) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Auto asignacion de nadadores')
            .content('Esta seguro que desea auto asignar los nadadores a las pruebas. Las pruebas en progreso o finalizadas no seran modificadas')
            .ariaLabel('Auto Asignar')
            .ok('Auto Asignar')
            .cancel('Cancelar')
            .targetEvent(ev);
        this.$mdDialog.show(confirm).then(() =>
            this.tournamentService.autoAssignSwimmersToEvents(this.tournament.id)
                .then(() => this.feedbacks.autoAssignSwimmers.setSuccess('Asignacion terminada exitosamente')),
            () => {
                //
            });
    }

    deleteEvent(ev, tournamentEvent: TournamentEvent) {
        var confirm = this.$mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('Eliminado de Prueba')
            .content('Esta seguro que desea eliminar la prueba: ' + tournamentEvent.number)
            .ariaLabel('Eliminar Prueba')
            .ok('Eliminar Prueba')
            .cancel('Cancelar')
            .targetEvent(ev);
        this.$mdDialog.show(confirm).then(() => {
            this.tournamentService.deleteEvent(this.tournament.id, tournamentEvent.id)
                .then(() => {
                    this.onUpdate();
                })
                .catch((error) => {
                    console.log(error);

                    this.$mdDialog.show(
                        this.$mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Eliminado de Prueba')
                            .textContent('No ha sido posible eliminar la prueba. Ha ocurrido un error inesperado.')
                            .ariaLabel('Error eliminando la prueba')
                            .ok('Ok')
                            .targetEvent(ev)
                    );
                });
        }, () => {
            //
        });
    }
}

export let tournamentEvents: ng.IComponentOptions = {
    templateUrl: 'app/components/tournaments/tournament-events.component.html',
    controller: TournamentEvents,
    bindings: {
        tournament: '<',
        onUpdate: '&'
    }
}; 