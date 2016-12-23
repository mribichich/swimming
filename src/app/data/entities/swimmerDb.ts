import { Gender } from 'app/enums/gender';

export class SwimmerDb {
	id: string;
	firstName: string;
	lastName: string;
	birthDate: string;
	nid: string;
	gender: Gender;
	city: string;
	team: string;
}