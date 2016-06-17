import { Gender } from 'app/enums/gender';

export class Swimmer {
	id: string;
	firstName: string;
	lastName: string;
	birthDate: Date;
	nid: string;
	gender: Gender;

	get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

	get age(): number {
		if (!this.birthDate) {
			return 0;
		}

		var ageDifMs = Date.now() - this.birthDate.getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

	get genderDescription(): string {
		switch (this.gender) {
			case Gender.Male:
				return 'Hombre';
			case Gender.Female:
				return 'Mujer';
		}
    }
}