import { Category, TournamentEvent, Swimmer } from 'app/entities';
export declare class TournamentDb {
    constructor();
    id: string;
    name: string;
    startDateTime: string;
    categories: Category[];
    events: TournamentEvent[];
    swimmerIds: string[];
    swimmers: Array<Swimmer>;
}
