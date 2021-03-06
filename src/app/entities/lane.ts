import { Swimmer, SeedTime } from 'app/entities';

export class Lane {
	number: number;
	swimmerId: string;
	raceTime: string;

	swimmer: Swimmer;
	seedTime: SeedTime;
}