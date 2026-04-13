if (!localStorage.getItem('alerts')) {
  localStorage.setItem('alerts', JSON.stringify([
    { "id": 25, "area": "ירושלים", "time": "16:45", "level": "גבוהה", "description": "אזעקת צבע אדום בירושלים ופרברים - היכנסו מיידית למרחב מוגן" },
    { "id": 24, "area": "מרכז", "time": "16:38", "level": "גבוהה", "description": "שיגור רקטות לעבר גוש דן - כניסה מיידית למרחב מוגן" },
    { "id": 23, "area": "צפון", "time": "16:30", "level": "גבוהה", "description": "אזעקת צבע אדום בנהריה וקריית שמונה - היכנסו למרחב מוגן" },
    { "id": 22, "area": "דרום", "time": "16:22", "level": "גבוהה", "description": "אזעקת צבע אדום בבאר שבע והסביבה - היכנסו למרחב מוגן" },
    { "id": 21, "area": "שפלה", "time": "16:15", "level": "גבוהה", "description": "ירי רקטות לעבר אשקלון ואשדוד - כניסה מיידית למרחב מוגן" },
    { "id": 20, "area": "מרכז", "time": "16:08", "level": "בינונית", "description": "חדירת כלי טיס עוין לאזור תל אביב - הישארו ליד מרחב מוגן" },
    { "id": 19, "area": "ירושלים", "time": "15:58", "level": "בינונית", "description": "התרעה על חפץ חשוד ברחוב יפו - הימנעו מהאזור" },
    { "id": 18, "area": "צפון", "time": "15:50", "level": "בינונית", "description": "זוהתה פעילות חשודה בגבול הצפון - הישארו ערניים" },
    { "id": 17, "area": "דרום", "time": "15:43", "level": "בינונית", "description": "זוהה כלי רכב חשוד בכביש 40 - הימנעו מהאזור" },
    { "id": 16, "area": "שפלה", "time": "15:35", "level": "בינונית", "description": "זוהה פעילות חשודה באזור רחובות - הישארו ערניים" },
    { "id": 15, "area": "צפון", "time": "15:28", "level": "נמוכה", "description": "תרגיל פיקוד העורף בחיפה והקריות - אין צורך בפעולה" },
    { "id": 14, "area": "מרכז", "time": "15:20", "level": "נמוכה", "description": "תרגיל כיבוי אש באזור פתח תקווה - אין סכנה לציבור" },
    { "id": 13, "area": "דרום", "time": "15:12", "level": "נמוכה", "description": "תרגיל חירום בנגב - אין צורך בפעולה" },
    { "id": 12, "area": "ירושלים", "time": "15:23", "level": "נמוכה", "description": "תרגיל פינוי בבית חולים הדסה - אין סכנה לציבור" },
    { "id": 11, "area": "שפלה", "time": "15:05", "level": "נמוכה", "description": "תרגיל מגן דוד אדום באזור לוד ורמלה - אין צורך בפעולה" },
    { "id": 10, "area": "ירושלים", "time": "14:55", "level": "הודעה", "description": "הסתיימה האזעקה בירושלים - ניתן לצאת מהמרחב המוגן" },
    { "id": 9, "area": "מרכז", "time": "14:47", "level": "הודעה", "description": "בוטלה האזעקה בפתח תקווה - ניתן לשוב לשגרה" },
    { "id": 8, "area": "צפון", "time": "14:38", "level": "הודעה", "description": "הסתיים תרגיל פיקוד העורף בחיפה - חזרה לשגרה" },
    { "id": 7, "area": "דרום", "time": "14:30", "level": "הודעה", "description": "הוסרה האזעקה מעוטף עזה - ניתן לחזור לפעילות רגילה" },
    { "id": 6, "area": "שפלה", "time": "14:22", "level": "הודעה", "description": "הסתיימה ההתרעה באזור אשדוד - ניתן לשוב לשגרה" },
    { "id": 5, "area": "צפון", "time": "14:10", "level": "גבוהה", "description": "ירי טילים לעבר כלי רכב צבאי בגליל - היכנסו למרחב מוגן" },
    { "id": 4, "area": "דרום", "time": "14:02", "level": "בינונית", "description": "זוהה בלון תצפית עוין מעל הנגב - הישארו ערניים" },
    { "id": 3, "area": "מרכז", "time": "13:55", "level": "נמוכה", "description": "תרגיל הגנה אזרחית בראשון לציון - אין סכנה לציבור" },
    { "id": 2, "area": "ירושלים", "time": "13:47", "level": "גבוהה", "description": "פיגוע דקירה בשוק מחנה יהודה - הימנעו מהאזור" },
    { "id": 1, "area": "שפלה", "time": "13:40", "level": "הודעה", "description": "הסתיים אירוע החירום בגדרה - חזרה לשגרה מלאה" }
  ]));
}

function getAllAlertsFromDB() {
  const alerts = localStorage.getItem('alerts');
  if (!alerts)
    return JSON.stringify([]);
  return alerts;
}

function getAlertByAreaFromDB(area) {
  if (!area)
    throw { status: 400, responseText: 'נדרש אזור כדי לקבל התראות' };
  const alerts = JSON.parse(localStorage.getItem('alerts')) || [];
  const areaAlerts = alerts.filter(alert => alert.area == area);
  return JSON.stringify(areaAlerts);
}

function addAlertFromDB(data) {
  data = JSON.parse(data);
  if (!data)
    throw { status: 400, responseText: 'נדרשים נתונים כדי להוסיף התראה' };
  let alerts = JSON.parse(localStorage.getItem('alerts')) || [];
  data.id = alerts.length + 1;
  alerts.unshift(data);
  localStorage.setItem('alerts', JSON.stringify(alerts));
}

function updateAlertFromDB(data, id) {
  data = JSON.parse(data);
  if (!data || !id)
    throw { status: 400, responseText: 'נדרשים נתונים ומספר מזהה לעדכון התראה' };
  const alerts = JSON.parse(localStorage.getItem('alerts'));
  alerts.forEach((alert, index) => {
    if (alert.id == id) {
      alerts[index] = data;
      return;
    }
  });
  localStorage.setItem('alerts', JSON.stringify(alerts));

}

function deleteAlertFromDB(id) {
  if (!id)
    throw { status: 400, responseText: 'מספר מזהה נדרש כדי למחוק התראה' };
  const alerts = JSON.parse(localStorage.getItem('alerts'));
  const updatedAlerts = alerts.filter(alert => alert.id != id);
  localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
}

