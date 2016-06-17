import { Category, TournamentEvent, Swimmer } from 'app/entities';
export declare class Tournament {
    constructor();
    id: string;
    name: string;
    startDateTime: Date;
    categories: Array<Category>;
    events: Array<TournamentEvent>;
    swimmerIds: Array<string>;
    swimmers: Array<Swimmer>;
}
