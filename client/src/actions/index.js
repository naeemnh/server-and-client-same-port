import axios from 'axios';
import { FETCH_USER } from './types';

// getting the User details
export const fetchUser = () => async (dispatch) => {
	const response = await axios.get('/api/current_user');
	dispatch({ type: FETCH_USER, payload: response.data });
};

// Handling token on payment
export const handleToken = (token) => async (dispatch) => {
	const response = await axios.post('/api/stripe', token);
	dispatch({ type: FETCH_USER, payload: response.data });
};
