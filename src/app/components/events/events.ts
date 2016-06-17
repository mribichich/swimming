'use strict';

import * as _ from 'underscore';

import { ITournamentService } from 'app/services';
import { IHistoryService } from 'app/services/historyService';
import { Tournament, TournamentEvent, Swimmer } from 'app/entities';
import { CategoryType } from 'app/enums/categoryType';
import { CategoryFactory, SwimmerFactory } from 'app/factories';
import { Feedback } from 'app/libs/feedback/feedback';

/*@ngInject*/
class Events {
    constructor(
        private $window,
        private tournamentService: ITournamentService,
        private $location: ng.ILocationService,
        private $rootRouter
    ) {
    }

    fromRoute;
    tournament: Tournament;

    feedbacks = {
        autoAssignSwimmers: new Feedback()
    };

    $routerOnActivate(toRoute, fromRoute) {
        this.fromRoute = fromRoute;

        this.getTournament(toRoute.params.tournamentId)
            .then(() => this.getEventsCategories());
    }

    goBack() {
        // this.$location.path(this.fromRoute.urlPath);
        this.$rootRouter.navigate(['/TournamentDetails', { id: this.tournament.id }]);
    }

    navigateTo(to) {
        this.$rootRouter.navigate(to);
    }

    getTournament(id: string): ng.IPromise<void> {
        return this.tournamentService.get(id)
            .then((tournament) => {
                this.tournament = tournament;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getEventsCategories() {
        this.tournament.events.forEach(event => {
            let categoryDb = _.find(this.tournament.categories, (category) => {
                return category.id === event.categoryId;
            });

            event.category = CategoryFactory.Create(categoryDb);
        });
    }

    autoAssignSwimmers() {
        this.tournamentService.autoAssignSwimmersToEvents(this.tournament.id)
            .then(() => this.feedbacks.autoAssignSwimmers.setSuccess('Asignacion terminada exitosamente'));
    }
}

export let events = {
    templateUrl: 'app/components/events/events.html',
    controller: Events
};