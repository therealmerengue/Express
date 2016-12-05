function createChart(context, labels, data, legendLabel) {
    new Chart(context, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: legendLabel,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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
        }
    });
}

function presentData(data) {
    var labels = jlinq.from(data.history).select(function(rec) {
        return rec.properties.date;
    });
    var speedValues = jlinq.from(data.history).select(function(rec) {
        return rec.properties.speed;
    });
    var distanceValues = jlinq.from(data.history).select(function(rec) {
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