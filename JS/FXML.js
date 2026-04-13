class FXMLHttpRequest {
  constructor() {
    this.status = 0;
    this.readyState = 0;
    this.onReadyStateChange = null;
    this.responseText = '';
    this.request = null;
  }

  open(type, url, sync) {
    this.request = {
      type: type,
      url: url,
      sync: sync !== false,
      status: this.status,
      responseText: this.responseText,
      readyState: this.readyState,
      data: null
    };
    this.readyState = 1;
    this.callOnReadyStateChange();
  }

  send(data = null) {
    this.request.data = data;
    try {
      networkSend(this.request, (receivedResponse) => {
        this.response(receivedResponse);
      });
      this.readyState = 2;
      this.callOnReadyStateChange();
    } catch (error) {
      this.readyState = 2;
      this.callOnReadyStateChange();
      this.response({
        status: 404,
        responseText: JSON.stringify("משהו השתבש, אנא נסה שוב.")
      });
    }
  }

  callOnReadyStateChange() {
    if (this.onReadyStateChange) {
      this.onReadyStateChange();
    }
  }

  response(response) {
    this.status = response.status;
    this.responseText = response.responseText;
    this.readyState = 4;
    this.callOnReadyStateChange();
  }
}