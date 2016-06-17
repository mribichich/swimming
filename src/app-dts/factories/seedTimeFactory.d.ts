import { SeedTime, Swimmer } from 'app/entities';
export declare class SeedTimeFactory {
    static CreateFromDb(seedTimeDb: any): SeedTime;
    static Create(swimmer: Swimmer): SeedTime;
}
