import configs from './configs'
import moment from "moment";

const apiService = {

  async login(email, password) {
    
    const url = `${configs.baseURL}/login`

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    return data
  },

  async checkAuthentication(token, subdomain, site) {
    if(token && subdomain && site){
      return true
    } else {
      return false
    }
    
  },

  async fetchSiteIVModules(token, siteId){
    const url = `${configs.baseURL}/sites/${siteId}/site_iv_modules`

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${token}`
      }
    })
    const data = await res.json()
    return data
  },

  async fetchDetectionsData(token, siteId, date, type, camId, opt){
    const url = `${configs.baseURL}/detections/search`

    var rawBody = JSON.stringify({})
    if(camId) {
      rawBody = JSON.stringify({
        "detection_type": type,
        "site_id": [siteId],
        "camera_id": [camId],
        "timestamp": moment.utc(date).format("YYYY-MM-DD"),
        "ignored": false,
        "page": 1,
        "per_page": 400,
        "details": opt
      });
    } else {
      rawBody = JSON.stringify({
        "detection_type": type,
        "site_id": [siteId],
        "timestamp": moment.utc(date).format("YYYY-MM-DD"),
        "ignored": false,
        "page": 1,
        "per_page": type === "mask_compliance" ? 400 : 5,
        "details": opt
      });
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${token}`
      },
      body: rawBody
    })
    const data = await res.json()
    return data
  },

  async getSites() {
    // const url = `${this.baseUrl}/sites`
    // const res  = await fetch(url)
    // const data = await res.json()
    const data = [{"id":1,"name":"Gurgaon - Palam Vihar","organization_id":1,"created_at":"2020-10-27T19:27:38.772Z","updated_at":"2020-10-27T19:27:38.772Z","slug":"gurgaon-palam-vihar"}]
    return data
  },

  async getSiteIvModules(subdomain) {
    // const url = `${this.baseUrl}/sites/${siteId}/site_iv_modules`
    // const res  = await fetch(url)
    // const data = await res.json()
    let data 
    if (subdomain === 'epoch') {
      data = [{ "id": 1, "site_id": 1, "iv_module_id": 1, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 1, "name": "Mask Detect", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
        { "id": 2, "site_id": 1, "iv_module_id": 2, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 2, "name": "Social Distance", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
        { "id": 3, "site_id": 1, "iv_module_id": 3, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 3, "name": "Night Productivity", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
        { "id": 4, "site_id": 1, "iv_module_id": 4, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 4, "name": "Night Duty Rounds", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
        { "id": 5, "site_id": 1, "iv_module_id": 5, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 5, "name": "Fall Detect", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
        // { "id": 6, "site_id": 1, "iv_module_id": 6, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 6, "name": "Wall Breach", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
        { "id": 6, "site_id": 1, "iv_module_id": 6, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 6, "name": "Abuse Risk Patient", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
      ]
    } else if (subdomain === "gennex") {
      data = [{ "id": 2, "site_id": 2, "iv_module_id": 2, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 2, "name": "Mask Detect", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } },
        { "id": 1, "site_id": 1, "iv_module_id": 1, "created_at": "2020-10-27T19:54:11.588Z", "updated_at": "2020-10-27T19:54:11.588Z", "iv_module": { "id": 1, "name": "Safety Detect", "description": "", "created_at": "2020-10-27T19:49:59.888Z", "updated_at": "2020-11-10T07:13:49.552Z" } }]
    } else {
      data = [{"id":1,"site_id":1,"iv_module_id":1,"created_at":"2020-10-27T19:54:11.588Z","updated_at":"2020-10-27T19:54:11.588Z","iv_module":{"id":1,"name":"Mask Detect","description":"","created_at":"2020-10-27T19:49:59.888Z","updated_at":"2020-11-10T07:13:49.552Z"}},{"id":2,"site_id":1,"iv_module_id":2,"created_at":"2020-11-11T10:33:17.099Z","updated_at":"2020-11-11T10:33:17.099Z","iv_module":{"id":2,"name":"Touch Detect","description":"","created_at":"2020-11-11T10:32:41.356Z","updated_at":"2020-11-11T10:32:41.356Z"}}, {"id":3,"site_id":1,"iv_module_id":3,"created_at":"2020-11-11T10:33:17.099Z","updated_at":"2020-11-11T10:33:17.099Z","iv_module":{"id":3,"name":"Clean Detect","description":"","created_at":"2020-11-11T10:32:41.356Z","updated_at":"2020-11-11T10:32:41.356Z"}}, {"id":4,"site_id":1,"iv_module_id":4,"created_at":"2020-10-27T19:54:11.588Z","updated_at":"2020-10-27T19:54:11.588Z","iv_module":{"id":4,"name":"Social Distance","description":"","created_at":"2020-10-27T19:49:59.888Z","updated_at":"2020-11-10T07:13:49.552Z"}}]

    }
    return data
  }
}

export default apiService