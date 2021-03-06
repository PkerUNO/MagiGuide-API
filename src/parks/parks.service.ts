import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Parks as Themeparks } from 'themeparks';

import { Attraction } from './attraction.model';
import { AttractionWaitTime } from './attraction-wait-time.model';
import { AttractionStatus } from './attraction-status.enum';
import { Parks } from './parks.enum';
import { Status, ThemeparksWaitTimes } from './themeparks-wait-times.interface';

@Injectable()
export class ParksService {
	public parks = {
		[Parks.DisneylandParisDisneylandPark]: new Themeparks.DisneylandParisMagicKingdom(),
		[Parks.DisneylandParisWaltDisneyStudios]: new Themeparks.DisneylandParisWaltDisneyStudios()
	};
	private statusToAttractionStatus = {
		[Status.Closed]: AttractionStatus.Closed,
		[Status.Down]: AttractionStatus.Down,
		[Status.Operating]: AttractionStatus.Operating,
		[Status.Refurbishment]: AttractionStatus.Refurbishment
	};

	public async getAttractions(park: Parks): Promise<Attraction[]> {
		return this.parks[park].GetWaitTimes()
			.then((attractions: ThemeparksWaitTimes[]) => {
				return attractions.map(attraction => {
					const schedule = attraction.schedule ? {
						closingTime: attraction.schedule.closingTime,
						openingTime: attraction.schedule.openingTime
					} : null;

					return {
						fastpassEnabled: attraction.fastPass,
						id: attraction.id,
						name: attraction.name,
						schedule,
						updated: moment(attraction.lastUpdate).toDate()
					} as Attraction;
				});
			});
	}

	public async getWaitTimes(park: Parks): Promise<AttractionWaitTime[]> {
		return this.parks[park].GetWaitTimes()
			.then((attractions: ThemeparksWaitTimes[]) => {
				return attractions.map(attraction => {
					return {
						active: attraction.active,
						id: attraction.id,
						status: this.statusToAttractionStatus[attraction.status],
						updated: moment(attraction.lastUpdate).toDate(),
						waitTime: attraction.waitTime
					} as AttractionWaitTime;
				});
			});
	}
}
