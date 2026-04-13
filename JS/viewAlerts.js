function getAllAlerts(userType) {
  const url = "/api/alerts";
  let presentation;
  if (userType === "administrator") {
    presentation = document.getElementById('administratorPresentAlerts');
    let menubar = document.getElementById('administrator-menubar');
    menubar.style.display = "flex";
  } else {
    presentation = document.getElementById('userPresentAlerts');
  }
  const httpRequest = new FXMLHttpRequest();
  httpRequest.onReadyStateChange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200 || httpRequest.status === 201) {
        let allAlerts = JSON.parse(httpRequest.responseText);
        presentation.innerHTML = " ";
        presentation.innerHTML = `<div class="section-header"><h3 class="section-title">כל ההתראות</h3></div>`;
        if (allAlerts.length === 0) {
          presentation.innerHTML = `<div class="no-alerts"><svg class="no-alert-icon" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 4 L46 13 L46 29 C46 39 37 46 26 50 C15 46 6 39 6 29 L6 13 Z" fill="#2980b9" opacity="0.15"/><path d="M26 4 L46 13 L46 29 C46 39 37 46 26 50 C15 46 6 39 6 29 L6 13 Z" stroke="#2980b9" stroke-width="3"/><polyline points="17,26 23,32 35,20" stroke="#2980b9" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><p>אין התראות פעילות כרגע</p></div>`;
        }
        else {
          if (userType === "administrator") {
            displayAdminAlerts(allAlerts, presentation);
          } else {
            displayUserAlerts(allAlerts, presentation);
          }  
        }
      } else {
        presentation.innerHTML = " ";
        presentation.innerHTML = ` ${httpRequest.status}. ${httpRequest.responseText ? JSON.parse(httpRequest.responseText) : "אנא נסה שנית."}`
      }
    }
  };
  httpRequest.open("GET", url, true);
  httpRequest.send();
}

function getAlertsByArea(userType) {
  let presentation;
  try {
    let area;
    if (userType === "administrator") {
      area = document.getElementById('areaInput').value;
      presentation = document.getElementById('administratorPresentAlerts');
    } else {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      area = currentUser.area;
      presentation = document.getElementById('userPresentAlerts');
    }
    validateArea(area);
    const url = `/api/alerts/area/${area}`;
    const httpRequest = new FXMLHttpRequest();
    httpRequest.onReadyStateChange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200 || httpRequest.status === 201) {
          let areaAlerts = JSON.parse(httpRequest.responseText);
          presentation.innerHTML = " ";
          presentation.innerHTML = `<div class="section-header"><h3 class="section-title">התראות באזור ${area}</h3></div>`;
          if (areaAlerts.length === 0) {
            presentation.innerHTML = `<div class="no-alerts"><svg class="no-alert-icon" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 4 L46 13 L46 29 C46 39 37 46 26 50 C15 46 6 39 6 29 L6 13 Z" fill="#2980b9" opacity="0.15"/><path d="M26 4 L46 13 L46 29 C46 39 37 46 26 50 C15 46 6 39 6 29 L6 13 Z" stroke="#2980b9" stroke-width="3"/><polyline points="17,26 23,32 35,20" stroke="#2980b9" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><p>אין התראות פעילות באזור ${area}</p></div>`;
          }
          else {
            if (userType === "administrator") {
              displayAdminAlerts(areaAlerts, presentation);
            } else {
              displayUserAlerts(areaAlerts, presentation);
            }            }
        } else {
          presentation.innerHTML = " ";
          presentation.innerHTML = ` ${httpRequest.status}. ${httpRequest.responseText ? JSON.parse(httpRequest.responseText) : "אנא נסה שנית."}`
        }
      }
    };
    httpRequest.open("GET", url, true);
    httpRequest.send();
  }
  catch (error) {
    presentation.innerHTML = `<div class="message-container" style="display: block;">${error}</div>`;
  }
}