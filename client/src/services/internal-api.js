import axios from 'axios';

export default class InternalService {

  _apiBase = 'http://localhost:3000/';

  async getAuthentication(url, username, password) {
    return await axios.post(`${this._apiBase}${url}`, {
            uname : username,
            pw : password,
          });
  }

  async getPersonalia() {
    return await axios.get(`${this._apiBase}personalia`);
  }
}
