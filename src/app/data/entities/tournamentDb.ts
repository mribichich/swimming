import { Category, TournamentEvent, Swimmer } from 'app/entities';

export class TournamentDb {
	id: string;
	name: string;
	startDateTime: string;

	categories: Category[];
	events: TournamentEvent[];
	swimmerIds: string[];

	// swimmers: Array<Swimmer>;
}