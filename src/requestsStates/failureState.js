import initialState from './initialState';

const failureState = errors => ({
	...initialState,
	hasFailed: true,
	errors,
});

export default failureState;
