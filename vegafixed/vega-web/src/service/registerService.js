import { doPostLogin, BASE_API_URL} from './BaseAPI.js';


export const register = async (data) => {
  return await doPostLogin(`${BASE_API_URL}/users/register`, data);
};