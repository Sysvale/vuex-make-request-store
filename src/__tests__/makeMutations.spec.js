import makeMutations from '../makeMutations';

describe('makeMutations', () => {
	test('should return 3 mutations based on given name', () => {
		const mutations = makeMutations('dummyName');

		expect(Object.keys(mutations).length).toBe(3);
		expect(mutations).toMatchObject({
			dummyNameRequest: expect.any(Function),
			dummyNameSuccess: expect.any(Function),
			dummyNameFailure: expect.any(Function),
		});
	});

	test('should apply respective state when function is called', () => {
		const mutations = makeMutations('dummyName');

		const state = {}
		mutations.dummyNameRequest(state);

		expect(state).toMatchObject({
			isFetching: true,
			hasFailed: false,
			hasSucceeded: false,
			errors: {},
		});

		mutations.dummyNameSuccess(state);

		expect(state).toMatchObject({
			isFetching: false,
			hasFailed: false,
			hasSucceeded: true,
			errors: {},
		});

		mutations.dummyNameFailure(state, { msg: 'error message' });

		expect(state).toMatchObject({
			isFetching: false,
			hasFailed: true,
			hasSucceeded: false,
			errors: {
				msg: 'error message'
			},
		});
	});
});
