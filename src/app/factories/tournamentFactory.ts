'use strict';

import uuid = require('node-uuid');

import * as mapper from 'app/libs/automapper';
import { CategoryFactory, EventFactory, SwimmerFactory } from 'app/factories';
import { Tournament, Category, TournamentEvent, Swimmer } from 'app/entities';
import { TournamentDb } from 'app/data/entities';

export class TournamentFactory {
	static Create(tournamentDb?:TournamentDb): Tournament {
		var tournament = new Tournament();

		if (tournamentDb) {
			// mapper.map(tournamentDb, tournament);

			tournament.id = tournamentDb.id;
			tournament.name = tournamentDb.name;
			tournament.startDateTime = new Date(tournamentDb.startDateTime);
			tournament.swimmerIds = tournamentDb.swimmerIds;

			for (let i = 0; i < tournamentDb.categories.length; i++) {
				tournament.categories[i] = CategoryFactory.Create(tournamentDb.categories[i]);
			}

			tournament.categories.sort((a: Category, b: Category) => {
				return a.name.localeCompare(b.name);
			});

			for (let i = 0; i < tournamentDb.events.length; i++) {
				tournament.events[i] = EventFactory.Create(tournamentDb.events[i], tournamentDb.categories);
			}

			tournament.events.sort((a: TournamentEvent, b: TournamentEvent) => {
				return a.number - b.number;
			});

			// for (let i = 0; i < tournament.swimmers.length; i++) {
			// 	tournament.swimmers[i] = SwimmerFactory.Create(tournament.swimmers[i]);
			// }

			// tournament.swimmers.sort((a: Swimmer, b: Swimmer) => {
			// 	return a.fullName.localeCompare(b.fullName);
			// });
		} else {
			tournament.id = uuid.v4();
		}

		return tournament;
	}
}