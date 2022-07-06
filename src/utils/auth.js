export default {
  headers: (json = true) => {
    const token = localStorage.getItem('pikaToken');
    const emp_no = localStorage.getItem('pikaEmpNo');
    const headers = {token};
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }
};
