import axios from 'axios';
import * as FileSystem from 'expo-file-system';

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

  async sendEmail (email, photo, description) {
    let formData = new FormData();

    const photoInfo = await FileSystem.getInfoAsync(photo);
    if (photoInfo.exists) {
        const photoData = await FileSystem.readAsStringAsync(photo, {
            encoding: FileSystem.EncodingType.Base64,
        });

        formData.append("email", email);
        formData.append("photo", photoData);
        formData.append("description", description);

        return await axios.post(`${this._apiBase}sendMissingPhoto`,
              formData,
              { headers: {
                    'Content-Type': 'multipart/form-data'
                  }
              }
        );
    }
  }
}
