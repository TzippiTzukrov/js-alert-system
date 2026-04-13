function displayAdminAlerts(alerts, presentation) {
  alerts.forEach(alert => {
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert-item";
    alertDiv.setAttribute("data-level", alert.level);

    const menuWrapper = document.createElement("div");
    menuWrapper.className = "alert-menu-wrapper";

    const menuBtn = document.createElement("button");
    menuBtn.className = "alert-menu-btn";
    menuBtn.innerHTML = "<span class='menu-dots'>⋮</span>";

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "alert-options-menu hidden";

    const updateBtn = document.createElement("button");
    updateBtn.className = "option-btn update-btn";
    updateBtn.innerHTML = `<svg class='btn-icon' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z' stroke='#2980b9' stroke-width='1.5' stroke-linejoin='round'/></svg> עדכון`;
    updateBtn.onclick = () => updateAlert(alert, presentation);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "option-btn delete-btn";
    deleteBtn.innerHTML = `<svg class='btn-icon' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><polyline points='2,4 14,4' stroke='#c0392b' stroke-width='1.5' stroke-linecap='round'/><path d='M5 4V3h6v1M6 7v5M10 7v5' stroke='#c0392b' stroke-width='1.5' stroke-linecap='round'/><rect x='3' y='4' width='10' height='9' rx='1' stroke='#c0392b' stroke-width='1.5'/></svg> מחיקה`;
    deleteBtn.onclick = () => deleteAlert(alert, presentation);

    optionsDiv.appendChild(updateBtn);
    optionsDiv.appendChild(deleteBtn);

    menuBtn.onclick = (e) => {
      e.stopPropagation();
      document.querySelectorAll(".alert-options-menu").forEach(div => {
        if (div !== optionsDiv) div.classList.add("hidden");
      });
      optionsDiv.classList.toggle("hidden");
      if (!optionsDiv.classList.contains("hidden")) {
        optionsDiv.style.right = '';
        optionsDiv.style.left = '';
        const menuRect = optionsDiv.getBoundingClientRect();
        const mainRect = document.getElementById('main-content').getBoundingClientRect();
        if (menuRect.left < mainRect.left) {
          optionsDiv.style.right = 'auto';
          optionsDiv.style.left = '0';
        } else if (menuRect.right > mainRect.right) {
          optionsDiv.style.left = 'auto';
          optionsDiv.style.right = '0';
        }
      }
    };

    menuWrapper.appendChild(menuBtn);
    menuWrapper.appendChild(optionsDiv);

    const alertInfo = document.createElement("div");
    alertInfo.className = "alert-info";
    const timeFormatted = alert.time.includes('T') ? alert.time.split('T')[1].substring(0, 5) : alert.time;
    alertInfo.innerHTML = `
            <strong>אזור:</strong> ${alert.area}<br>
            <strong>שעה:</strong> ${timeFormatted}<br>
            <strong>דרגת איום:</strong> ${alert.level}<br>
            <strong>פרטים:</strong> ${alert.description}
        `;

    alertDiv.appendChild(menuWrapper);
    alertDiv.appendChild(alertInfo);
    presentation.appendChild(alertDiv);
  });

  document.body.addEventListener("click", () => {
    document.querySelectorAll(".alert-options-menu").forEach(div => div.classList.add("hidden"));
  });
}

function updateAlert(alert, presentation) {
  try {
    history.pushState(null, null, "#administrator");
    presentation.innerHTML = "";
    let alertFormInputs = createAlertForm(presentation);
    alertFormInputs.area.value = alert.area;
    alertFormInputs.time.value = alert.time;
    alertFormInputs.level.value = alert.level;
    alertFormInputs.description.value = alert.description;
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-primary form-submit-btn";
    submitBtn.innerHTML = `<svg class='btn-icon' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><polyline points='2,8 6,12 14,4' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg> עדכן התראה`;
    submitBtn.onclick = (e) => {
      e.preventDefault();
      try {
        validateArea(alertFormInputs.area.value);
        validateLevel(alertFormInputs.level.value);
        validateDescription(alertFormInputs.description.value);
        alert.area = alertFormInputs.area.value;
        alert.time = alertFormInputs.time.value;
        alert.level = alertFormInputs.level.value;
        alert.description = alertFormInputs.description.value;
        const url = `/api/alerts/${alert.id}`;
        alert = JSON.stringify(alert);
        const httpRequest = new FXMLHttpRequest();
        httpRequest.onReadyStateChange = function () {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 201) {
              presentation.innerHTML = "התראה עודכנה בהצלחה.";
              setTimeout(() => {
                presentation.innerHTML = "";
                getAllAlerts('administrator');
              }, 1500);
            } else {
              presentation.innerHTML = ` ${httpRequest.status}. ${httpRequest.responseText ? JSON.parse(httpRequest.responseText) : "אנא נסה שנית."}`;
            }
          }
        };

        httpRequest.open("PUT", url, true);
        httpRequest.send(alert);
      }
      catch (validationError) {
        presentation.innerHTML = `<div class="message-container" style="display: block;">${validationError}</div>`;
      }
    };

    presentation.appendChild(submitBtn);
  }
  catch (error) {
    presentation.innerHTML = error ? error : "שגיאה בעדכון ההתראה, אנא נסה שנית.";
  }
}

function deleteAlert(alert, presentation) {
  history.pushState(null, null, "#administrator");
  presentation.innerHTML = "";
  const menubar = document.getElementById("administrator-menubar")
  menubar.style.display = "none";
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert-item";
  const alertInfo = document.createElement("div");
  alertInfo.className = "alert-info";
  const timeFormatted = alert.time.includes('T') ? alert.time.split('T')[1].substring(0, 5) : alert.time;
  alertInfo.innerHTML = `
            <strong>אזור:</strong> ${alert.area}<br>
            <strong>שעה:</strong> ${timeFormatted}<br>
            <strong>דרגת איום:</strong> ${alert.level}<br>
            <strong>פרטים:</strong> ${alert.description}
        `;
  const deleteAlertDiv = document.createElement("div");
  const deleteAlertMsg = document.createElement("div");
  deleteAlertMsg.className = "delete-confirmation";
  deleteAlertMsg.innerHTML = `<svg class='warning-icon' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 2L22 20H2L12 2z' fill='#f39c12' opacity='0.2'/><path d='M12 2L22 20H2L12 2z' stroke='#f39c12' stroke-width='2' stroke-linejoin='round'/><rect x='11' y='9' width='2' height='6' rx='1' fill='#7d5a00'/><rect x='11' y='17' width='2' height='2' rx='1' fill='#7d5a00'/></svg> האם אתה בטוח שאתה רוצה למחוק את ההתראה?`
  const deleteAlertBtn = document.createElement("button");
  deleteAlertBtn.className = "btn btn-danger delete-confirm-btn";
  deleteAlertBtn.innerHTML = `<svg class='btn-icon' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><polyline points='2,4 14,4' stroke='white' stroke-width='1.5' stroke-linecap='round'/><path d='M5 4V3h6v1M6 7v5M10 7v5' stroke='white' stroke-width='1.5' stroke-linecap='round'/><rect x='3' y='4' width='10' height='9' rx='1' stroke='white' stroke-width='1.5'/></svg> מחק התראה`;
  deleteAlertBtn.onclick = (e) => {
    e.preventDefault();
    const url = `/api/alerts/${alert.id}`;
    alert = JSON.stringify(alert);
    const httpRequest = new FXMLHttpRequest();
    httpRequest.onReadyStateChange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200 || httpRequest.readyState === 201) {
          presentation.innerHTML = "ההודעה נמחקה בהצלחה."
          setTimeout(() => {
            getAllAlerts('administrator');
            presentation.innerHTML = "";
          }, 1500);
        }
        else {
          presentation.innerHTML = ` ${httpRequest.status}. ${httpRequest.responseText ? JSON.parse(httpRequest.responseText) : "אנא נסה שנית."}`;
        }
      }
    }
    httpRequest.open("DELETE", url, true);
    httpRequest.send(alert);
  }
  const backBtn = document.createElement("button");
  backBtn.className = "btn btn-secondary back-btn";
  backBtn.innerHTML = "&#8594; חזרה להתראות";
  backBtn.onclick = () => getAllAlerts('administrator');
  presentation.appendChild(backBtn);
  presentation.appendChild(deleteAlertMsg);
  alertDiv.appendChild(deleteAlertDiv);
  alertDiv.appendChild(alertInfo);
  presentation.appendChild(alertDiv);
  presentation.appendChild(deleteAlertBtn);

}

function addAlert() {
  history.pushState(null, null, "#administrator");
  let presentation = document.getElementById("administratorPresentAlerts");
  try {
    presentation.innerHTML = "";
    let alertFormInputs = createAlertForm(presentation);
    let alert = {
      id: null,
      area: null,
      time: null,
      level: null,
      description: null
    }
    const addAlertBtn = document.createElement("button");
    addAlertBtn.className = "btn btn-success form-submit-btn";
    addAlertBtn.innerHTML = `<svg class='btn-icon' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='8' cy='8' r='6.5' stroke='white' stroke-width='1.5'/><line x1='8' y1='4.5' x2='8' y2='11.5' stroke='white' stroke-width='1.5' stroke-linecap='round'/><line x1='4.5' y1='8' x2='11.5' y2='8' stroke='white' stroke-width='1.5' stroke-linecap='round'/></svg> הוסף התראה`;
    addAlertBtn.onclick = (e) => {
      e.preventDefault();
      try {
        alert.area = alertFormInputs.area.value;
        alert.time = alertFormInputs.time.value;
        alert.level = alertFormInputs.level.value;
        alert.description = alertFormInputs.description.value;
        validateArea(alert.area);
        validateLevel(alert.level);
        validateDescription(alert.description);
        const url = `/api/alerts/add`;
        alert = JSON.stringify(alert);
        const httpRequest = new FXMLHttpRequest();
        httpRequest.onReadyStateChange = function () {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.readyState === 201) {
              presentation.innerHTML = "ההודעה נוספה בהצלחה."
              setTimeout(() => {
                getAllAlerts('administrator');
                presentation.innerHTML = "";
              }, 1500);
            }
            else {
              presentation.innerHTML = ` ${httpRequest.status}. ${httpRequest.responseText ? JSON.parse(httpRequest.responseText) : "אנא נסה שנית."}`
            }
          }
        }
        httpRequest.open("POST", url, true);
        httpRequest.send(alert);
      } catch (validationError) {
        presentation.innerHTML = `<div class="message-container" style="display: block;">${validationError}</div>`;
      }
    }
    presentation.appendChild(addAlertBtn);
  }
  catch (error) {
    presentation.innerHTML = error ? error : "שגיאה בהוספת ההתראה, אנא נסה שנית.";
  }
}

function createAlertForm(presentation) {
  const menubar = document.getElementById("administrator-menubar");
  menubar.style.display = "none";
  const backBtn = document.createElement("button");
  backBtn.className = "btn btn-secondary back-btn";
  backBtn.innerHTML = "&#8594; חזרה להתראות";
  backBtn.onclick = () => getAllAlerts('administrator');
  presentation.appendChild(backBtn);
  const setAlert = document.createElement("form");
  setAlert.className = "alert-form";
  const inputAreaLabel = document.createElement("label");
  inputAreaLabel.innerText = "אזור";
  inputAreaLabel.htmlFor = "inputArea";
  const inputArea = document.createElement("input");
  inputArea.id = "inputArea";
  inputArea.type = "text";
  inputArea.placeholder = "אזור";
  inputArea.setAttribute("list", "areas");
  const inputTimeLabel = document.createElement("label");
  inputTimeLabel.innerText = "שעה";
  inputTimeLabel.htmlFor = "inputTime";
  const inputTime = document.createElement("input");
  inputTime.id = "inputTime";
  inputTime.type = "text";
  inputTime.placeholder = "זמן";

  const inputLevelLabel = document.createElement("label");
  inputLevelLabel.innerText = "דרגה";
  inputLevelLabel.htmlFor = "inputLevel";
  const inputLevel = document.createElement("input");
  inputLevel.id = "inputLevel";
  inputLevel.type = "text";
  inputLevel.placeholder = "דרגה";
  inputLevel.setAttribute("list", "levels");

  const inputDescriptionLabel = document.createElement("label");
  inputDescriptionLabel.innerText = "תאור";
  inputDescriptionLabel.htmlFor = "inputDescription";
  const inputDescription = document.createElement("input");
  inputDescription.id = "inputDescription";
  inputDescription.type = "text";
  inputDescription.placeholder = "תאור";

  setAlert.appendChild(inputAreaLabel);
  setAlert.appendChild(inputArea);
  setAlert.appendChild(inputTimeLabel);
  setAlert.appendChild(inputTime);
  setAlert.appendChild(inputLevelLabel);
  setAlert.appendChild(inputLevel);
  setAlert.appendChild(inputDescriptionLabel);
  setAlert.appendChild(inputDescription);
  presentation.appendChild(setAlert);

  const alertFormInputs = {
    area: inputArea,
    time: inputTime,
    level: inputLevel,
    description: inputDescription
  }

  return alertFormInputs;
}