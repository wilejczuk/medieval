import axios from 'axios';

export default class InternalService {

  _apiBase = 'http://localhost:3000/';
  _clientBase = 'http://localhost:3001/';
  symbolsEnum = ['а', 'б', 'в', 'г', 'д', 'ѣ', 'ѧ'];

  async getAuthentication(url, username, password) {
    return await axios.post(`${this._apiBase}${url}`, {
            uname : username,
            pw : password,
          });
  }

  async getPersonalia() {
    return await axios.get(`${this._apiBase}personalia-list`);
  }

  async getPersonaliaToAdd() {
    return await axios.get(`${this._apiBase}personalia-with-saints`);
  }

  async getStamps() {
    return await axios.get(`${this._apiBase}stamps`);
  }

  async getSomeStamps(params) {
    return await axios.get(`${this._apiBase}parametrizedStamps`, {params: params});
  }

  async getDictionaries() {
    return await axios.get(`${this._apiBase}selectDictionaries`);
  }
}
