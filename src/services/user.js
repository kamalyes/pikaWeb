import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  const {emp_no, ...params_copy} = params;
  return await request(`${CONFIG.URL}/user/verifytoken`, {
    method: 'POST',
    headers: {
      ...params_copy,
      'emp-no': emp_no
    },
  })
}

export async function queryNotices(params) {
  const res = await request(`${CONFIG.URL}/notification/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
  return res.data;
}

export async function updateNotices(params) {
  return await request(`${CONFIG.URL}/notification/read`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function deleteNotice(params) {
  return await request(`${CONFIG.URL}/notification/delete`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}


export async function queryAllUser(params) {
  const res = await request(`${CONFIG.URL}/user/alluser`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
  return res.data;
}

export async function updateUsers(data) {
  return await request(`${CONFIG.URL}/user/info/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateAvatar(data) {
  const formData = new FormData();
  formData.append("file", data.file)
  return await request(`${CONFIG.URL}/oss/avatar`, {
    method: 'POST',
    data: formData,
    requestType: 'form',
    headers: auth.headers(false),
  });
}

export async function deleteUsers(params) {
  return await request(`${CONFIG.URL}/auth/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function listUserActivities(params) {
  return await request(`${CONFIG.URL}/operation/count`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// 根据用户id查询用户操作记录
export async function listUserOperationLog(params) {
  return await request(`${CONFIG.URL}/operation/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function loginGithub(params) {
  return await request(`${CONFIG.URL}/auth/github/login`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function queryUserStatistics(params) {
  return await request(`${CONFIG.URL}/workspace/`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function queryFollowTestPlanData(params) {
  return await request(`${CONFIG.URL}/workspace/testplan`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

