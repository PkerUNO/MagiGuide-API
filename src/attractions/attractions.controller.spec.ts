import { Test, TestingModule } from '@nestjs/testing';

import { AttractionsController } from './attractions.controller';

describe('Attractions Controller', () => {
	let controller: AttractionsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AttractionsController]
		}).compile();

		controller = module.get<AttractionsController>(AttractionsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
