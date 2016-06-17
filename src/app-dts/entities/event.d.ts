import { EventGenderType } from 'app/enums/eventGenderType';
import { Category, Swimmer, SeedTime, Heat } from 'app/entities';
export declare class TournamentEvent {
    constructor();
    id: string;
    number: number;
    distance: string;
    style: string;
    categoryId: string;
    genderType: EventGenderType;
    swimmerIds: Array<string>;
    swimmers: Array<Swimmer>;
    seedTimes: SeedTime[];
    heats: Heat[];
    genderDescription: string;
    category: Category;
    addSwimmer(swimmer: Swimmer): void;
}
