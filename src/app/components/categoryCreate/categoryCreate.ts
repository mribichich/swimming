// app css
import * as styles from './category-create.component.css!css-modules';

// app js
import { TournamentService } from 'app/services';
import { Tournament, Category } from 'app/entities';
import { CategoryFactory } from 'app/factories';
import * as FeedbackLib from 'app/libs/feedbackLib';

class CategoryCreate {
  /*@ngInject*/
  constructor(
    private tournamentService: TournamentService,
    private $location: ng.ILocationService,
    private $window,
    private $routeParams
  ) {
  }

  styles = styles;

  viewAction: string;

  feedbacks = {
    save: new FeedbackLib.Feedback()
  };

  tournament: Tournament;

  category: Category;

  submitted: boolean = false;

  $onInit() {
    var promise = this.getTournament(this.$routeParams.tournamentId)
      .then(() => {
        if (!this.$routeParams.categoryId) {
          this.viewAction = 'Create';

          this.category = CategoryFactory.Create();
        } else {
          this.viewAction = 'Edit';

          promise.then(() => this.getCategory(this.$routeParams.categoryId));
        }
      });
  }

  goBack() {
    this.$location.path(`/tournaments/details/${this.tournament.id}`);
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
    let categories = this.tournament.categories.filter((item) => {
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

    this.tournamentService.addCategory(this.tournament, this.category)
      .then((data) => this.processCreateCategory(data))
      .catch((error) => this.catchCreateCategoryError(error))
      .finally(() => {
        this.feedbacks.save.isWorking = false;
      });
  }

  private processCreateCategory(data) {
    this.feedbacks.save.setSuccess();

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

    this.tournamentService.updateCategoryDetails(this.tournament.id, this.category)
      .then((data) => this.processEditCategory(data))
      .catch((error) => this.catchEditCategoryError(error))
      .finally(() => {
        this.feedbacks.save.isWorking = false;
      });
  }

  private processEditCategory(data) {
    this.feedbacks.save.setSuccess();

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
