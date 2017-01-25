import { CategoryDb, TournamentEventDb } from 'app/data/entities';

export class TournamentDb {
  id: string;
  name: string;
  startDateTime: string;

  categories: CategoryDb[];
  events: TournamentEventDb[];
  swimmerIds: string[];

  // swimmers: Array<Swimmer>;
}
