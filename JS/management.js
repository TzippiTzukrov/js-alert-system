function validatePassword(userPassword) {
  if (userPassword.length < 4) {
    throw 'סיסמה חייבת להיות באורך של 4 תווים לפחות';
  }
}

function validateArea(userArea) {
  if (userArea != "ירושלים" && userArea != "מרכז" && userArea != "שפלה" && userArea != "דרום" && userArea != "צפון") {
    throw 'אזור לא תקין';
  }
}

function validateLevel(level) {
  if (level != "גבוהה" && level != "נמוכה" && level != "בינונית" && level != "הודעה") {
    throw 'רמת התראה לא תקינה';
  }
}

function validateDescription(description) {
  if (description.length < 5) {
    throw 'תיאור חייב להיות באורך של 5 תווים לפחות';
  }
}

function showTemplate(templateName) {
  const container = document.getElementById('main-content');
  container.innerHTML = '';
  const template = document.getElementById(`${templateName}-template`);
  if (template) {
    const clone = document.importNode(template.content, true);
    container.appendChild(clone);
    setTimeout(() => {
      hideMessageContainer('login-message');
      hideMessageContainer('signup-message');
    }, 100);
  }
  if (templateName === 'signup' || templateName === 'login' || templateName === 'entry') {
    localStorage.removeItem("currentUser");
  }
  const logoutBtn = document.getElementById('header-logout-btn');
  if (logoutBtn) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    logoutBtn.style.display = currentUser ? 'inline-flex' : 'none';
  }
  if (templateName === 'administrator') {
    getAllAlerts('administrator');
  }
  if (templateName === 'user') {
    getAlertsByArea('user');
  }
}

window.addEventListener("load", function () {
  const hash = window.location.hash;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    if (currentUser.userType === "administrator") {
      showTemplate("administrator");
    } else {
      showTemplate("user");
    }
  }
  else {
    const templateName = hash.slice(1) || "entry";
    if (templateName === "entry" && window.location.hash !== "#entry") {
      history.pushState(null, null, "#entry");
    }
    showTemplate(templateName);
  }
});

window.addEventListener("popstate", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const hash = window.location.hash;

  if (hash === "#signup" || hash === "#login" || hash === "#entry") {
    showTemplate(hash.slice(1));
    return;
  }

  if (currentUser) {
    if (currentUser.userType === "administrator") {
      showTemplate("administrator");
    } else {
      showTemplate("user");
    }
  } else {
    history.pushState(null, null, "#entry");
    showTemplate("entry");
  }
});

function logout() {
  history.pushState(null, null, "#entry");
  showTemplate('entry');
}

function returnToEntry() {
  history.pushState(null, null, "#entry");
  showTemplate('entry');
}