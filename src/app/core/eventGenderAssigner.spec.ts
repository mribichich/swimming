import { EventGenderAssigner } from 'app/core/eventGenderAssigner';
import { EventGenderType } from 'app/enums/eventGenderType';
import { Gender } from 'app/enums/gender';

describe('event gender assigner spec', () => {
	it('should assign the eventgender males when it is male', () => {
		const is = EventGenderAssigner.isGender(EventGenderType.Males, Gender.Male);
		expect(is).toBe(true);
	});

	it('should assign the eventgender females when it is female', () => {
		const is = EventGenderAssigner.isGender(EventGenderType.Females, Gender.Female);
		expect(is).toBe(true);
	});

	it('should assign the eventgender mixed when it is male', () => {
		const is = EventGenderAssigner.isGender(EventGenderType.Mixed, Gender.Male);
		expect(is).toBe(true);
	});

	it('should assign the eventgender mixed when it is female', () => {
		const is = EventGenderAssigner.isGender(EventGenderType.Mixed, Gender.Female);
		expect(is).toBe(true);
	});

	it('should not assign the eventgender males when it is female', () => {
		const is = EventGenderAssigner.isGender(EventGenderType.Males, Gender.Female);
		expect(is).toBe(false);
	});

	it('should not assign the eventgender females when it is male', () => {
		const is = EventGenderAssigner.isGender(EventGenderType.Females, Gender.Male);
		expect(is).toBe(false);
	});
});