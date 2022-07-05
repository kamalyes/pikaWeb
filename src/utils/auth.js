import {message, notification} from 'antd';
import {listUsers} from '@/services/user';

export default {
  headers: (json = true) => {
    const token = localStorage.getItem('pikaToken');
    const headers = {token};
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },
  notificationResponse: (res, info = false, position = 'topRight') => {
    if (!res || res.code === undefined) {
      notification.error({message: "网络开小差了，请稍后重试", placement: position})
      return false;
    }
    if (res.code === 200) {
      if (info) {
        notification.success({
          message: res.message,
          placement: position,
        });
      }
      return true;
    }
    if (res.code === 401) {
      // 说明用户未认证
      // message.info(res.msg);
      localStorage.setItem('pikaToken', null);
      localStorage.setItem('pikaUser', null);
      const href = window.location.href;
      if (href.indexOf("/user/login") === -1) {
        const uri = href.split("redirect=")
        window.location.href = `/#/user/login?redirect=${uri[uri.length - 1]}`
        // window.open(`/#/user/login?redirect=${href}`)
      }
      notification.info({
        message: res.detail,
        placement: res.detail,
      });
      return false;
    }
    notification.error({message: res.msg, placement: position})
    return false;
  },
  response: (res, info = false) => {
    if (!res || res.code === undefined) {
      message.error("网络开小差了，请稍后重试")
      return false;
    }
    if (res.code === 200) {
      if (info) {
        message.success(res.message);
      }
      return true;
    }
    if (res.code === 401) {
      // 说明用户未认证
      localStorage.setItem('pikaToken', null);
      localStorage.setItem('pikaUser', null);
      const href = window.location.href;
      if (href.indexOf("/user/login") === -1) {
        const uri = href.split("redirect=")
        window.location.href = `/#/user/login?redirect=${uri[uri.length - 1]}`
        // window.open(`/#/user/login?redirect=${href}`)
      }
      message.info(res.detail);
      return false;
    }
    message.error(res.detail);
    return false;
  },
  getUserMap: async () => {
    const user = await listUsers();
    const temp = {};
    user.forEach((item) => {
      temp[item.id] = item;
    });
    return temp;
  }
};
