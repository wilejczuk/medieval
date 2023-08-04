import axios from 'axios';

export default class InternalService {

  //_apiBase = 'http://localhost:3000/';
  _apiBase = 'https://server.kievan-rus.online/';

  async getPersonalia() {
    return await axios.get(`${this._apiBase}personalia-list`);
  }

  async getCoinSections() {
    return await axios.get(`${this._apiBase}coinSections`);
  }

  async getCoinIssuers(params) {
    return await axios.get(`${this._apiBase}coinIssuers`, {params: params});
  }

  async getIssuersCoins(params) {
    return await axios.get(`${this._apiBase}issuersCoins`, {params: params});
  }

  async getWishedCoins(params) {
    return await axios.get(`${this._apiBase}wishedCoins`, {params: params});
  }

  async getCoinType(params) {
    return await axios.get(`${this._apiBase}coinType`, {params: params});
  }

}
