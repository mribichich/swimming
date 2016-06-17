import { HeatAssigner } from 'app/core/heatAssigner';

describe('heat assigner spec', () => {
	it('should calculate 1 heat when the count of swimmers is 6', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(6)).toEqual([6]);
	});

	it('should calculate 1 heat when the count of swimmers is less than 6', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(4)).toEqual([4]);
	});

	it('should calculate 2 heats with 3 and 4 lanes when the coutn of swimmers is 7', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(7)).toEqual([3,4]);
	});

	it('should calculate 2 heats with 3 and 5 lanes when the coutn of swimmers is 8', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(8)).toEqual([3,5]);
	});

	it('should calculate 2 heats with 3 and 6 lanes when the coutn of swimmers is 9', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(9)).toEqual([3,6]);
	});

	it('should calculate 2 heats with 4 and 6 lanes when the coutn of swimmers is 10', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(10)).toEqual([4,6]);
	});

	it('should calculate 2 heats with 5 and 6 lanes when the coutn of swimmers is 11', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(11)).toEqual([5,6]);
	});

	it('should calculate 2 heats with 6 and 6 lanes when the coutn of swimmers is 12', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(12)).toEqual([6,6]);
	});

	it('should calculate 3 heats with 3, 4 and 6 lanes when the coutn of swimmers is 13', () => {
		let x = new HeatAssigner();
		expect(x.calculateLanes(13)).toEqual([3, 4, 6]);
	});
});