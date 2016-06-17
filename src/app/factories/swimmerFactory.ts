'use strict';

import uuid = require('node-uuid');

import { Swimmer } from 'app/entities/swimmer';
import * as mapper from 'app/libs/automapper';

export class SwimmerFactory {
	static Create(swimmerDb?): Swimmer {
		var swimmer = new Swimmer();

		if (swimmerDb) {
			swimmer.id = swimmerDb.id;
			swimmer.firstName = swimmerDb.firstName;
			swimmer.lastName = swimmerDb.lastName;
			swimmer.birthDate = new Date(swimmerDb.birthDate);
			swimmer.nid = swimmerDb.nid;
			swimmer.gender = swimmerDb.gender;

			// swimmer.fullName = swimmer.firstName + ' ' + swimmer.lastName;
		} else {
			swimmer.id = uuid.v4();
		}

		return swimmer;
	}
}