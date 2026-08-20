import {doPostLogin,BASE_API_URL} from './BaseAPI.js';

export function login(userInfo){
	return doPostLogin(`${BASE_API_URL}/users/login`, userInfo);
}