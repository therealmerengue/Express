function createChart(context, labels, data, legendLabel) {
    new Chart(context, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: legendLabel,
                data: data,
                backgroundColor: "rgba(159,204,0,0.2)",
                borderColor: "rgba(159,204,0,1)",
                pointBackgroundColor: "rgba(159,204,0,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "rgba(159,204,0,0.8)",
                pointHoverBorderColor: "rgba(159,204,0,1)",
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
            }
        },
        responsive: true
    });
}

function presentData(data) {
    if (data.history.length > 50) {
        var dataHistory = data.history.slice(-50);
    }
    else {
        dataHistory = data.history;
    }

    var labels = jlinq.from(dataHistory).select(function(rec) {
        return rec.properties.date;
    });
    var speedValues = jlinq.from(dataHistory).select(function(rec) {
        return rec.properties.speed;
    });
    var distanceValues = jlinq.from(dataHistory).select(function(rec) {
        return rec.properties.distance;
    });
    labels.push(data.current[0].properties.date);
    speedValues.push(data.current[0].properties.speed);
    distanceValues.push(data.current[0].properties.distance);
    var speedChartCtx = document.getElementById('speedChart');
    createChart(speedChartCtx, labels, speedValues, 'km/h');
    var distanceChartCtx = document.getElementById('distanceChart');
    createChart(distanceChartCtx, labels, distanceValues, 'km');
}