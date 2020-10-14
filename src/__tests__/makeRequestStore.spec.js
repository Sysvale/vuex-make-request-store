import makeRequestStore from '../index';
import initialState from '../requestsStates/initialState';

describe('makeRequestStore', () => {
	test('should return an object with one only key labeled as given name', () => {
		const test = () => {};
		const returned = makeRequestStore({ test });

		expect(returned).toMatchObject({
			test: expect.any(Object),
		});
		expect(Object.keys(returned).length).toBe(1);
	});

	test('should start with initial state', () => {
		const test = () => {};
		const returned = makeRequestStore({ test });

		expect(returned.test.state).toMatchObject({
			...initialState,
		});
	});

	test('should have an action with the given name', () => {
		const test = () => {};
		const returned = makeRequestStore({ test });

		expect(returned.test.actions).toMatchObject({
			test: expect.any(Function),
		});
	});

	test('the action should commit the Request mutation', () => {
		const test = () => new Promise((resolve, reject) => {});
		const returned = makeRequestStore({ test });
		const commit = jest.fn();
	
		returned.test.actions.test({ commit }, {});

		expect(commit).toHaveBeenCalledWith('testRequest');
	});

	test('the action should commit the Success mutation when the promise resolves', async () => {
		expect.assertions(2);
	
		const test = () => new Promise((resolve, reject) => {
			resolve({
				data: {
					testSuccess: 'yay',
				},
			});
		});
		const returned = makeRequestStore({ test });
		const commit = jest.fn();
	
		await returned.test.actions.test({ commit }, {})
			.then(data => {
				expect(commit).toHaveBeenCalledWith('testSuccess');
				expect(data).toMatchObject({
					testSuccess: 'yay',
				});
			});
	});

	test('the action should commit the Failure mutation when the promise rejects', async () => {
		expect.assertions(1);
	
		const test = () => new Promise((resolve, reject) => {
			reject({
				data: {
					error: ':(',
				},
			});
		});
		const returned = makeRequestStore({ test });
		const commit = jest.fn();

		try {
			await returned.test.actions.test({ commit }, {});
		} catch (e) {
			expect(commit).toHaveBeenCalledWith('testFailure', {
				data: {
					error: ':(',
				},
			});
		}
	});
});
