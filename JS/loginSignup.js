localStorage.removeItem("current user")

function signup(event) {
  event.preventDefault();
  try {
    const url = "/api/users/signup";
    let presentation = document.getElementById('signup-message');
    const userName = document.getElementById("sign-username").value;
    const userEmail = document.getElementById("sign-email").value;
    const userPassword = document.getElementById("sign-password").value;
    const userArea = document.getElementById("area").value;
    const userType = checkUserType(userEmail);
    validateArea(userArea);
    validatePassword(userPassword);
    const data = { name: userName, email: userEmail, password: userPassword, area: userArea, userType: userType, action: "signup" };
    const httpRequest = new FXMLHttpRequest();
    httpRequest.onReadyStateChange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200 || httpRequest.status === 201) {
          localStorage.setItem("currentUser", JSON.stringify(data));
          if (userType === "administrator") {
            history.pushState(null, null, "#administrator");
            showTemplate('administrator');
          } else {
            history.pushState(null, null, "#user");
            showTemplate('user');
          }
        } else {
          presentation.innerHTML = ` ${httpRequest.status}. ${httpRequest.responseText ? JSON.parse(httpRequest.responseText) : "אנא נסה שנית."}`;
          showMessageContainer('signup-message');
        }
      }
    };
    httpRequest.open("POST", url, true);
    httpRequest.send(data);
  }
  catch (error) {
    document.getElementById('signup-message').innerHTML = error ? error : "שגיאה במהלך ההרשמה, אנא נסה שנית.";
    showMessageContainer('signup-message');
  }
}

function login(event) {
  event.preventDefault();
  try {
    const url = "/api/users/login";
    let presentation = document.getElementById('login-message');
    const userEmail = document.getElementById("login-email").value;
    const userPassword = document.getElementById("login-password").value;
    validatePassword(userPassword);
    let data = { email: userEmail, password: userPassword, action: "login" };
    const httpRequest = new FXMLHttpRequest();
    httpRequest.onReadyStateChange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200 || httpRequest.status === 201) {
          data = JSON.parse(httpRequest.responseText);
          localStorage.setItem("currentUser", JSON.stringify(data));
          if (data.userType === "administrator") {
            history.pushState(null, null, "#administrator");
            showTemplate('administrator');
          } else {
            history.pushState(null, null, "#user");
            showTemplate('user');
          }
        }
        else {
          presentation.innerHTML = "";
          presentation.innerHTML = ` ${httpRequest.status}. ${httpRequest.responseText ? JSON.parse(httpRequest.responseText) : "אנא נסה שנית."}`;
          showMessageContainer('login-message');
        }
      }
    }
    httpRequest.open("POST", url, true);
    httpRequest.send(data);
  }
  catch (error) {
    document.getElementById('login-message').innerHTML = error ? error : "שגיאה במהלך ההתחברות, אנא נסה שנית.";
    showMessageContainer('login-message');
  }

}

function showSignup() {
  if (window.location.hash !== "#signup") {
    history.pushState(null, null, "#signup");
  }
  showTemplate('signup');
}

function showLogin() {
  if (window.location.hash !== "#login") {
    history.pushState(null, null, "#login");
  }
  showTemplate('login');
}

function checkUserType(email) {
  if (email === "manager@gmail.com")
    return "administrator";
  else
    return "user";
}

function showMessageContainer(messageId) {
  const messageElement = document.getElementById(messageId);
  if (messageElement && messageElement.innerHTML.trim() !== '') {
    messageElement.style.display = 'block';
  }
}

function hideMessageContainer(messageId) {
  const messageElement = document.getElementById(messageId);
  if (messageElement) {
    messageElement.style.display = 'none';
    messageElement.innerHTML = '';
  }
}
