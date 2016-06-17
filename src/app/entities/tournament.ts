import { Category, TournamentEvent, Swimmer } from 'app/entities';

export class Tournament {
	constructor() {
		this.categories = [];
		this.events = [];
		this.swimmerIds = [];
	}

	id: string;
	name: string;
	startDateTime: Date;

	categories: Array<Category>;
	events: Array<TournamentEvent>;
	swimmerIds: Array<string>;

	swimmers: Array<Swimmer>;
}