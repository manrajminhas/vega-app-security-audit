import {doGet, BASE_API_URL,doPut,doPostFile,doGetDownload} from './BaseAPI.js';

export function fetchUsers(token){
	return doGet(`${BASE_API_URL}/users`, token);
}

export function enableAccount(userId,token){
	return doPut(`${BASE_API_URL}/users/${userId}/active`, token)	;
}

export function changeAccountRole(userId,token,newRole) {
  return doPut(`${BASE_API_URL}/users/${userId}/role`, token, {
    newRole: newRole
  });
}

export function getFile(token){
  return doGet(`${BASE_API_URL}/files`, token);
}

export function createFile(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  return doPostFile(`${BASE_API_URL}/files`, token, formData);
}

export function downloadFile(filePath) {
  const encodedPath = encodeURIComponent(filePath);
  return doGetDownload(`${BASE_API_URL}/files/download?filePath=${encodedPath}`);
}