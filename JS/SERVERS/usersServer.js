const UsersServer = {
  handleRequest(request) {
    try {
      switch (request.data.action) {
        case "signup":
          return this.postAddUser(request.data);
        case "login":
          return this.putAuthUser(request.data);
        default:
          throw { status: 400, responseText: JSON.stringify("לא נמצא") };
      }
    } catch (response) {
      if (response.status && response.responseText) {
        return response;
      } else {
        return { status: 500, responseText: JSON.stringify("שגיאת שרת פנימית") };
      }
    }
  },

  postAddUser(data) {
    return addUser(data);
  },

  putAuthUser(data) {
    return authUsers(data);
  },
};
