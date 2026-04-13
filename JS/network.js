function networkSend(request, callback) {
  
  let networkFailureRate = 0;
  if (Math.random() < networkFailureRate) {
    return;
  }

  let delay = Math.random() * 200 + 100;
  setTimeout(() => {
    let response;
    if (request.url.startsWith('/api/users'))
      response = UsersServer.handleRequest(request);
    else if (request.url.startsWith('/api/alerts'))
      response = AlertServer.handleRequest(request);
    else {
      response = { status: 404, responseText: JSON.stringify('לא נמצא...') };
    }
    callback(response);
  }, delay);
}

