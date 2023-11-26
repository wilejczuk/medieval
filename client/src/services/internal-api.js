import axios from 'axios';

export default class InternalService {

  _apiBase = 'http://localhost:3000/';
  _clientBase = 'http://localhost:3001/';
  //_apiBase = 'https://server.kievan-rus.online/';
  //_clientBase = 'https://kievan-rus.online/';

  token = localStorage.getItem("token");
  defaultHeaders = { headers: 
      {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${this.token}`
      }
    }

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
    if (localStorage.getItem("token")) 
      return await axios.get(`${this._apiBase}stamps`) 
    else
      return await axios.get(`${this._apiBase}stampsSorted`);
  }

  async getDukes(params) {
    return await axios.get(`${this._apiBase}dukesList`, {params: params});
  }

  async getDukesEnum() {
    return await axios.get(`${this._apiBase}dukes`);
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

  async getLocationSpecimens(params) {
    return await axios.get(`${this._apiBase}locationSpecimens`, {params: params});
  }

  async getPublicationSpecimens(params) {
    return await axios.get(`${this._apiBase}publicationSpecimens`);
  }

  async getTypeAttributions(params) {
    return await axios.get(`${this._apiBase}typeAttributions`, {params: params});
  }

  async getSomeStamps(params) {
    return await axios.get(`${this._apiBase}parametrizedStamps`, {params: params});
  }

  async getDukesStamps(params) {
    return await axios.get(`${this._apiBase}dukesStamps`, {params: params});
  }

  async getDuke(params) {
    return await axios.get(`${this._apiBase}dukeData`, {params: params});
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

  async sendEmail (email, obverse, reverse, description) {
    let formData = new FormData();
    formData.append("email", email);
    formData.append("obverse", obverse);
    formData.append("reverse", reverse);
    formData.append("description", description);

    return await axios.post(`${this._apiBase}sendEmail`,
          formData,
          { headers: {
                'Content-Type': 'multipart/form-data'
              }
          }
    );
  }

  async addSpecimen(picture, size, weight, findingSpot, findingSpotComments, poster, publication, idObv, idRev, page, number) {
    let formData = new FormData();
    formData.append("picture", picture);
    if (size!=='') formData.append("size", size);
    if (weight!=='') formData.append("weight", weight);
    if (findingSpot!=='') formData.append("findingSpot", findingSpot);
    if (findingSpotComments!=='') formData.append("findingSpotComments", findingSpotComments);
    formData.append("poster", poster);
    formData.append("idObv", idObv);
    formData.append("idRev", idRev);
    formData.append("publication", publication);
    if (page!=='') formData.append("page", page);
    if (number!=='') formData.append("number", number);

    return await axios.post(`${this._apiBase}specimen`,
          formData, this.defaultHeaders
    );
  }

  async addAttribution(idPersona, idPublication, idObv, page, isTentative) {
    let formData = new FormData();
    formData.append("idPersona", idPersona);
    formData.append("idPublication", idPublication);
    formData.append("idObv", idObv);
    formData.append("page", page);
    formData.append("isTentative", isTentative?1:0);

    return await axios.post(`${this._apiBase}addAttribution`,
          formData, this.defaultHeaders
    );
  }

  async addTypeAndSpecimen (obvGroup, revGroup, obvIndex, revIndex,
    obvStamp, revStamp, obvDescription, revDescription, orient,
    picture, size, weight, findingSpot, findingSpotComments, publication, page, number, poster) {
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
      if (orient!==null) formData.append("orient", orient);

      // Specimens table
      formData.append("picture", picture);
      if (size!=='') formData.append("size", size);
      if (weight!=='') formData.append("weight", weight);
      if (findingSpot!=='') formData.append("findingSpot", findingSpot);
      if (findingSpotComments!=='') formData.append("findingSpotComments", findingSpotComments);
      formData.append("poster", poster);

      // Specimens-Publication table
      formData.append("publication", publication);
      if (page!=='') formData.append("page", page);
      if (number!=='') formData.append("number", number);

      return await axios.post(`${this._apiBase}typeAndSpecimen`,
            formData, this.defaultHeaders
      );
  }
}
