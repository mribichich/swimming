import URI from 'uri';

export interface QueryParam {
	key: string;
	value: string;
}

export interface IHistoryService {
	go(path: string): void;
	back(params?: QueryParam[]): string;
	foward(): string;
}

export class HistoryService implements IHistoryService {
/*@ngInject*/
    constructor(
		private $location,
		private $rootScope
        ) {
		$rootScope.$watch(() => {
			return $location.url();
		}, (path) => {
			// console.log(path);

			if (this.isMoving) {
				this.isMoving = false;
				return;
			}

			this.paths.push(path);
			this.currentIndex++;
		});
    }

	isMoving: boolean = false;
	currentIndex = -1;
	paths: string[] = [];

	go(path: string) {
		this.isMoving = true;

		this.$location.path(path);

		this.currentIndex++;

		this.paths.splice(this.currentIndex);

		this.paths.push(path);
	}

	back(params?: QueryParam[]): string {
		if (this.currentIndex === -1) {
			return undefined;
		}

		if (this.currentIndex === 0) {
			return '';
		}

		this.isMoving = true;

		this.currentIndex--;

		var back = this.paths[this.currentIndex];
		var uri = new URI(back);

		if (params) {
			for (var i = 0; i < params.length; i++) {
				uri.addSearch(params[i].key, params[i].value);
			}
		}

		this.$location.path(uri.toString());

		return back;
	}

	foward(): string {
		if (this.currentIndex === this.paths.length - 1) {
			return undefined;
		}

		this.isMoving = true;

		this.currentIndex++;

		var foward = this.paths[this.currentIndex];
		this.$location.path(foward);
		return foward;
	}
}