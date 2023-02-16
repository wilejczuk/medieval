import axios from 'axios';

export default class InternalService {

  _apiBase = 'http://localhost:3000/';
  _clientBase = 'http://localhost:3001/';
  //symbolsEnum = ['а', 'б', 'в', 'г', 'д', 'ѣ', 'ѧ'];

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

  async getLocations() {
    return await axios.get(`${this._apiBase}specimensGeo`);
  }

  async getLiterature() {
    return await axios.get(`${this._apiBase}literature`);
  }

  async getCoordinates(address) {
    return await axios.get(`https://geocode.maps.co/search?q="${address}"`);
  }

  async setCoordinates(params) {
    return await axios.get(`${this._apiBase}specimenCoordinates`, {params: params});
  }

  async getType(params) {
    return await axios.get(`${this._apiBase}type`, {params: params});
  }

  async getSomeStamps(params) {
    return await axios.get(`${this._apiBase}parametrizedStamps`, {params: params});
  }

  async getDictionaries() {
    return await axios.get(`${this._apiBase}selectDictionaries`);
  }

  async getSaint(params) {
    return await axios.get(`${this._apiBase}selectSaint`, {params: params});
  }

  async getCross(params) {
    return await axios.get(`${this._apiBase}selectCross`, {params: params});
  }

  async getLetter(params) {
    return await axios.get(`${this._apiBase}selectLetter`, {params: params});
  }

  async addSpecimen(picture, size, weight, findingSpot, findingSpotComments, publication, idObv, idRev, page, number) {
    let formData = new FormData();
    formData.append("picture", picture);
    if (size!=='') formData.append("size", size);
    if (weight!=='') formData.append("weight", weight);
    if (findingSpot!=='') formData.append("findingSpot", findingSpot);
    if (findingSpotComments!=='') formData.append("findingSpotComments", findingSpotComments);
    formData.append("idObv", idObv);
    formData.append("idRev", idRev);
    formData.append("publication", publication);
    formData.append("page", page);
    formData.append("number", number);

    return await axios.post(`${this._apiBase}specimen`,
          formData,
          { headers: {
                'Content-Type': 'multipart/form-data'
              }
          }
    );
  }

  async addTypeAndSpecimen (obvGroup, revGroup, obvIndex, revIndex,
    obvStamp, revStamp, obvDescription, revDescription, orient,
    picture, size, weight, findingSpot, findingSpotComments, publication, page, number) {
      let formData = new FormData();

      // Types table
      formData.append("obvGroup", obvGroup);
      if (revGroup!=='null') formData.append("revGroup", revGroup);
      if (obvIndex!=='null') formData.append("obvIndex", obvIndex);
      if (revIndex!=='null') formData.append("revIndex", revIndex);

      // Stamps table
      formData.append("obvStamp", obvStamp);
      formData.append("revStamp", revStamp);
      if (obvDescription!=='') formData.append("obvDescription", obvDescription);
      if (revDescription!=='') formData.append("revDescription", revDescription);
      if (orient!=='') formData.append("orient", orient);

      // Specimens table
      formData.append("picture", picture);
      if (size!=='') formData.append("size", size);
      if (weight!=='') formData.append("weight", weight);
      if (findingSpot!=='') formData.append("findingSpot", findingSpot);
      if (findingSpotComments!=='') formData.append("findingSpotComments", findingSpotComments);

      // Specimens-Publication table
      formData.append("publication", publication);
      formData.append("page", page);
      formData.append("number", number);

      return await axios.post(`${this._apiBase}typeAndSpecimen`,
            formData,
            { headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }
      );
  }
}
