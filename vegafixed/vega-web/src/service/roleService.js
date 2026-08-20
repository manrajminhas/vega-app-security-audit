import { doGet, BASE_API_URL} from './BaseAPI.js';

export const getCurrentUserRoles = async () => {
    const roles = await doGet(`${BASE_API_URL}/roles/new-users`);
    return roles;
};