import {listUsers} from '@/services/user';

export default {
  headers: (json = true) => {
    const token = localStorage.getItem('pikaToken');
    const emp_no = localStorage.getItem('pikaEmpNo');
    const headers = {token, 'emp-no': emp_no};
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },
  getUserMap: async () => {
    try {
      const user = await listUsers();
      const temp = {};
      user.forEach((item) => {
        temp[item.id] = item;
      });
      return temp;
    } catch (e) {
      return null

    }
  }

};
