import { CategoryType } from 'app/enums/categoryType';
import { Category, Swimmer } from 'app/entities';
import { CategorySwimmerAssigner } from 'app/core/categorySwimmerAssigner';
import { CategoryFactory, SwimmerFactory } from 'app/factories';


describe('category assigner spec', () => {
	// beforeEach(() => {
	// 	categoryAssigner = new CategorySwimmerAssigner();
	// });

	it('should assign the category by age', () => {
		let category = CategoryFactory.Create();
		category.type = CategoryType.ByAge;
		category.from = 10;
		category.to = 12;
		let swimmer = SwimmerFactory.Create();
		var year = new Date().getFullYear() - 11;
		swimmer.birthDate = new Date(year, 1, 1);

		const is = CategorySwimmerAssigner.isCategory(category, swimmer);
		expect(is).toBe(true);
	});

	it('should not assign the category by age', () => {
		let category = CategoryFactory.Create();
		category.type = CategoryType.ByAge;
		category.from = 10;
		category.to = 12;
		let swimmer = SwimmerFactory.Create();
		var year = new Date().getFullYear() - 14;
		swimmer.birthDate = new Date(year, 1, 1);

		const is = CategorySwimmerAssigner.isCategory(category, swimmer);
		expect(is).toBe(false);
	});

	it('should assign the category by year', () => {
		let category = CategoryFactory.Create();
		category.type = CategoryType.ByYear;
		category.from = 2000;
		category.to = 2002;
		let swimmer = SwimmerFactory.Create();
		swimmer.birthDate = new Date(2001, 1, 1);

		let is = CategorySwimmerAssigner.isCategory(category, swimmer);
		expect(is).toBe(true);

		swimmer.birthDate = new Date(2000, 1, 1);

		is = CategorySwimmerAssigner.isCategory(category, swimmer);
		expect(is).toBe(true);

		swimmer.birthDate = new Date(2002, 1, 1);

		is = CategorySwimmerAssigner.isCategory(category, swimmer);
		expect(is).toBe(true);
	});

	it('should not assign the category by year', () => {
		let category = CategoryFactory.Create();
		category.type = CategoryType.ByYear;
		category.from = 2000;
		category.to = 2002;
		let swimmer = SwimmerFactory.Create();
		swimmer.birthDate = new Date(2003, 1, 1);

		let is = CategorySwimmerAssigner.isCategory(category, swimmer);
		expect(is).toBe(false);

		swimmer.birthDate = new Date(1999, 1, 1);

		is = CategorySwimmerAssigner.isCategory(category, swimmer);
		expect(is).toBe(false);
	});
});