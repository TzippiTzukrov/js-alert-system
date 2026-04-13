function addUser(data) {
  if (!data || !data.email || !data.password)
    throw { status: 400, responseText: 'נדרשים אימייל וסיסמה כדי להוסיף משתמש' };
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(user => user.email === data.email)) {
    throw { status: 409, responseText: JSON.stringify('המשתמש כבר קיים') };
  }
  users.push(data);
  localStorage.setItem("users", JSON.stringify(users));
  return { status: 201, responseText: JSON.stringify('משתמש נוצר בהצלחה') };
}

function authUsers(data) {
  if (!data || !data.email || !data.password)
    throw {
      status: 400, responseText: JSON.stringify('נדרשים דוא"ל וסיסמה לאימות משתמש') };
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((user) => user.email === data.email && user.password === data.password);
  return user ? {status: 200, responseText: JSON.stringify(user)} : {status: 401, responseText: JSON.stringify('פרטי כניסה לא חוקיים')};
}

