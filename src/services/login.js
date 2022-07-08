import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import convterJsonToFromData from "@/utils/hander";

export async function login(params) {
  return request(`${CONFIG.URL}/user/login`, {
    method: 'POST',
    data: convterJsonToFromData(params),
    requestType: 'from',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });
}

// 注册接口
export async function register(params) {
  return request(`${CONFIG.URL}/user/register`, {
    method: 'POST',
    data: params,
  });
}

export async function getElCode(params) {
  return request(`${CONFIG.URL}/user/auth/elcode`, {
    method: 'POST',
    data: params,
  });
}
