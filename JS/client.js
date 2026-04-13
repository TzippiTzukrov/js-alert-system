function displayUserAlerts(alerts, presentation) {
    alerts.forEach(alert => {
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert-item";
        alertDiv.setAttribute("data-level", alert.level);
        const alertInfo = document.createElement("div");
        alertInfo.className = "alert-info";
        const timeFormatted = alert.time.includes('T') ? alert.time.split('T')[1].substring(0, 5) : alert.time;
        alertInfo.innerHTML = 
            `<strong>אזור:</strong> ${alert.area}<br>
            <strong>שעה:</strong> ${timeFormatted}<br>
            <strong>דרגת איום:</strong> ${alert.level}<br>
            <strong>פרטים:</strong> ${alert.description}
        `;
        alertDiv.appendChild(alertInfo);
        presentation.appendChild(alertDiv);
    });
}

