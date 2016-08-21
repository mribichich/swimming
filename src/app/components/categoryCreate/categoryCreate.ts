import { ITournamentService } from 'app/services';
// import { IHistoryService } from 'app/services/historyService';
import { Tournament, Category } from 'app/entities';
import { CategoryFactory } from 'app/factories';
import * as FeedbackLib from 'app/libs/feedbackLib';

class CategoryCreate {
/*@ngInject*/
    constructor(
        private tournamentService: ITournamentService,
        private $rootRouter,
        private $window
        // private historyService: IHistoryService
    ) {
    }

    viewAction: string;

    feedbacks = {
        save: new FeedbackLib.Feedback()
    };

    tournament: Tournament;

    category: Category;

    submitted: boolean = false;

    $routerOnActivate(toRoute, fromRoute) {
        var promise = this.getTournament(toRoute.params.tournamentId)
            .then(() => {
                if (angular.isUndefined(toRoute.params.categoryId)) {
                    this.viewAction = 'Create';

                    this.category = CategoryFactory.Create();
                } else {
                    this.viewAction = 'Edit';

                    promise.then(() => this.getCategory(toRoute.params.categoryId));
                }
            });
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
        var categories = this.tournament.categories.filter((item) => {
            return item.id === id;
        });

        this.category = categories[0];
    }

    saveCategory(isFormInvalid) {
        this.submitted = true;

        if (isFormInvalid) {
            return;
        }

        if (this.viewAction === 'Create') {
            this.createCategory();
        } else {
            this.editCategory();
        }
    }

    createCategory() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        // this.tournament.categories.push(this.category);
        
        this.tournamentService.addCategory(this.tournament, this.category)
            .then((data) => this.processCreateCategory(data))
            .catch((error) => this.catchCreateCategoryError(error))
            .finally(() => {
                this.feedbacks.save.isWorking = false;
            });
    }

    private processCreateCategory(data) {
        this.feedbacks.save.setSuccess();
        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");
        // this.$location.path(`/tournaments/${this.tournament.id}/categories`);
        this.goBack();
    }

    private catchCreateCategoryError(error) {
        console.error(error);
        this.feedbacks.save.setError('Ha ocurrido un error guardando los datos');
    }

    private finallyCreateCategory() {
        this.feedbacks.save.isWorking = false;
    }

    editCategory() {
        this.feedbacks.save.setNone();
        this.feedbacks.save.isWorking = true;

        this.tournamentService.edit(this.tournament)
            .then((data) => this.processEditCategory(data))
            .catch((error) => this.catchEditCategoryError(error))
            .finally(() => {
                this.feedbacks.save.isWorking = false;
            });
    }

    private processEditCategory(data) {
        this.feedbacks.save.setSuccess();
        // this.alertService.add(TSS.AngularJs.AlertType.success, "El registro se ha guardado correctamente");
        // this.$location.path(`/tournaments/${this.tournament.id}/categories`);
        this.goBack();
    }

    private catchEditCategoryError(error) {
        console.error(error);
        this.feedbacks.save.setError('Ha ocurrido un error guardando los datos');
    }
}

export let categoryCreate = {
    templateUrl: 'app/components/categoryCreate/categoryCreate.html',
    controller: CategoryCreate
};