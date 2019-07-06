const { RESTDataSource } = require('apollo-datasource-rest');

class CongiteDataFusion extends RESTDataSource {
  constructor() {
    super();
  }

  get baseURL() {
    return `https://api.cognitedata.com/api/v1/projects/${this.context.project}/`;
  }

  willSendRequest(request) {
    request.headers.set('api-key', this.context.apiKey);
  }

  async getAssets() {
    return this.get('assets');
  }

  async getAssetsById(ids) {
    console.log(ids)
    return this.post(`assets/byids`, {
        items: ids,
    });
  }

  async getEvents() {
    return this.get('events');
  }

  async getThreedModels() {
    return this.get('3d/models');
  }
}

module.exports = {
    CongiteDataFusion
}