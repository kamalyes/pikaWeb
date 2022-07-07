import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

export async function fetchDatabaseSource(params) {
  return request(`${CONFIG.URL}/online/sql/showtables`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function onlineExecuteSQL(params) {
  return request(`${CONFIG.URL}/online/sql/command`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}


export async function onlineRedisCommand(params) {
  return request(`${CONFIG.URL}/config/redis/command`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}
