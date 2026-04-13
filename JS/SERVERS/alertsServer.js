const AlertServer = {
  handleRequest(request) {
    try {
      switch (request.type) {
        case 'GET':
          if (request.url === '/api/alerts') {
            return this.getAllAlerts();
          } else if (request.url.startsWith('/api/alerts/area/')) {
            return this.getAlertByArea(request.url);
          } else {
            throw { status: 404, responseText: JSON.stringify('לא נמצא') };
          }
        case 'POST':
          return this.postAlert(request.data);
        case 'PUT':
          return this.putAlert(request);
        case 'DELETE':
          return this.deleteAlert(request.url);
        default:
          throw { status: 400, responseText: JSON.stringify('לא נמצא') };
      }
    }
    catch (response) {
      if (response.status && response.responseText) {
        return response;
      } else {
        return { status: 500, responseText: JSON.stringify('שגיאת שרת פנימית') };
      }
    }
  },

  getAllAlerts() {
    const response = {
      status: 200,
      responseText: getAllAlertsFromDB()
    }
    if (response.responseText.length === 0) {
      response.responseText = JSON.stringify('לא נמצאו התראות');
    }
    return response;
  },

  getAlertByArea(url) {
    let response;
    const area = this.getInfoFromUrl(url);

    if (!area) {
      response = { status: 400, responseText: JSON.stringify('נדרש אזור כדי לקבל התראות') };
    } else {
      response = {
        status: 200,
        responseText: getAlertByAreaFromDB(area)
      };
    }

    return response;
  },

  postAlert(data) {
    addAlertFromDB(data);
    const response = {
      status: 200,
      responseText: null
    }
    return response;
  },

  putAlert(request) {
    const id = this.getInfoFromUrl(request.url)
    updateAlertFromDB(request.data, id);
    const response = {
      status: 200,
      responseText: null
    }
    return response;
  },

  deleteAlert(url) {
    const id = this.getInfoFromUrl(url);
    deleteAlertFromDB(id);
    const response = {
      status: 200,
      responseText: null
    }
    return response;
  },

  getInfoFromUrl(url) {
    const parts = url.split('/');
    if (parts.length < 2 || !parts[parts.length - 1]) {
      throw { status: 400, responseText: JSON.stringify('פורמט כתובת URL לא חוקי') };
    }
    return parts[parts.length - 1];
  }
}