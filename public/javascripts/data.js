function createChart(context, labels, data, legendLabel) {
    return new Chart(context, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: legendLabel,
                data: data,
                backgroundColor: "rgba(64, 146, 217, 0.2)",
                borderColor: "rgba(64, 146, 217, 1)",
                pointBackgroundColor: "rgba(64, 146, 217, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "rgba(64, 146, 217, 0.8)",
                pointHoverBorderColor: "rgba(64, 146, 217, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            scaleBeginAtZero: true
        },
        responsive: true
    });
}

function presentData(data) {
    if (data.history.length > 25) {
        var dataHistory = data.history.slice(-25);
    }
    else {
        dataHistory = data.history;
    }

    var labels = jlinq.from(dataHistory).select(function(rec) {
        return rec.properties.date.toString().substring(0, 19).replace('T', ' ');
    });
    var speedValues = jlinq.from(dataHistory).select(function(rec) {
        return rec.properties.speed;
    });
    var distanceValues = jlinq.from(dataHistory).select(function(rec) {
        return rec.properties.distance;
    });
    labels.push(data.current[0].properties.date.toString().substring(0, 19).replace('T', ' '));
    speedValues.push(data.current[0].properties.speed);
    distanceValues.push(data.current[0].properties.distance);
    var speedChartCtx = document.getElementById('speedChart');
    var speedChart = createChart(speedChartCtx, labels, speedValues, 'km/h');
    var distanceChartCtx = document.getElementById('distanceChart');
    var distanceChart = createChart(distanceChartCtx, labels, distanceValues, 'km');

    return [speedChart, distanceChart];
}