export const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function handleResult(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function handleResponse(response, isBlob = false) {
  let result = isBlob
    ? await response.blob()
    : handleResult(await response.text());

  if (response.ok) {
    return result;
  }

  return Promise.reject({
    code: response.status,
    message: result?.message || response.statusText
  });
}

export async function doGet(url, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function doGetDownloadZip(url, token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/zip', Authorization:`Bearer ${token}`},
  });
  return handleResponse(response,true);
}

export async function doPut(url, token, data) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function doPostLogin(url, data) {
  console.debug('Request data:', data);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function doPostFile(url, token, data) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data,
    });

    return handleResponse(response);
  } catch (error) {
    console.error('POST file request failed:', error);
    throw error;
  }
}

export async function doPost(url, token, data) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return handleResponse(response);
}

export async function doPostDownload(url, data, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return handleResponse(response,true);
}

export async function doGetDownload(url) {
  const response = await fetch(url, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return handleResponse(response,true); 
}