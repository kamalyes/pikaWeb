import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function insertEnvironment(params) {
  return request(`${CONFIG.URL}/itstem/environment/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function deleteEnvironment(params) {
  return request(`${CONFIG.URL}/itstem/environment/delete`, {
    method: 'DELETE',
    params,
    headers: auth.headers(),
  });
}

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function updateEnvironment(params) {
  return request(`${CONFIG.URL}/itstem/environment/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
export async function listEnvironment(params) {
  return request(`${CONFIG.URL}/itstem/environment/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// gconfig
export async function insertGConfig(params) {
  return request(`${CONFIG.URL}/itstem/gconfig/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}


export async function deleteGConfig(params) {
  return request(`${CONFIG.URL}/itstem/gconfig/delete`, {
    method: 'DELETE',
    params,
    headers: auth.headers(),
  });
}


export async function updateGConfig(params) {
  return request(`${CONFIG.URL}/itstem/gconfig/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function listGConfig(params) {
  return request(`${CONFIG.URL}/itstem/gconfig/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}


// 获取gconfig列表

export async function insertDbConfig(params) {
  return request(`${CONFIG.URL}/itstem/dbconfig/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function deleteDbConfig(params) {
  return request(`${CONFIG.URL}/itstem/dbconfig/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function updateDbConfig(params) {
  return request(`${CONFIG.URL}/itstem/dbconfig/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function listDbConfig(params) {
  return request(`${CONFIG.URL}/itstem/dbconfig/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function onTestDbConfig(params) {
  return request(`${CONFIG.URL}/itstem/dbconfig/connect`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// redis

export async function insertRedisConfig(params) {
  return request(`${CONFIG.URL}/itstem/redis/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function deleteRedisConfig(params) {
  return request(`${CONFIG.URL}/itstem/redis/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function updateRedisConfig(params) {
  return request(`${CONFIG.URL}/itstem/redis/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function listRedisConfig(params) {
  return request(`${CONFIG.URL}/itstem/redis/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}


/**
 * 添加服务地址
 * @param data
 * @returns {Promise<any>}
 */
export async function insertGateway(data) {
  return request(`${CONFIG.URL}/itstem/gateway/insert`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteGateway(params) {
  return request(`${CONFIG.URL}/itstem/gateway/delete`, {
    method: 'DELETE',
    params,
    headers: auth.headers(),
  });
}


/**
 * 修改服务地址
 * @param data
 * @returns {Promise<any>}
 */
export async function updateGateway(data) {
  return request(`${CONFIG.URL}/itstem/gateway/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

/**
 * 获取网关地址
 * @param params
 * @returns {Promise<any>}
 */
export async function listGateway(params) {
  return request(`${CONFIG.URL}/itstem/gateway/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}


export async function uploadFile(params) {
  const formData = new FormData();
  formData.append("file", params.files[0].originFileObj)
  return request(`${CONFIG.URL}/oss/upload`, {
    method: 'POST',
    params: {filepath: params.filepath},
    data: formData,
    requestType: 'form',
    headers: auth.headers(false),
  });
}

export async function listFile() {
  return request(`${CONFIG.URL}/oss/list`, {
    method: 'GET',
    headers: auth.headers(),
  });
}

export async function deleteFile(params) {
  return request(`${CONFIG.URL}/oss/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function getSystemConfig() {
  return request(`${CONFIG.URL}/config/system`, {
    method: 'GET',
    headers: auth.headers(),
  });
}

export async function updateSystemConfig(data) {
  return request(`${CONFIG.URL}/config/system/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}



