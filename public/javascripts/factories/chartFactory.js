var app = angular.module('trackingApp');

app.factory('chartFactory', function() {
   var createChart = function(context, labels, data, legendLabel) {
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
           responsive: true,
           maintainAspectRatio: true
       });
   };

    return {
        presentData: function(data) {
            if (data.history.length > 25) {
                var dataHistory = data.history.slice(-25);
            }
            else {
                dataHistory = data.history;
            }

            var labels = jlinq.from(dataHistory).select(function (rec) {
                return rec.properties.date.toString().substring(0, 19).replace('T', ' ');
            });
            var speedValues = jlinq.from(dataHistory).select(function (rec) {
                return rec.properties.speed;
            });
            var distanceValues = jlinq.from(dataHistory).select(function (rec) {
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
        },
        updateChart: function(chart, label, newData) {
            chart.data.labels.push(label); // add new label at end
            chart.data.labels.splice(0, 1); // remove first label
            chart.data.datasets[0].data.push(newData);
            chart.data.datasets[0].data.splice(0, 1);
            chart.update();
        }
    };
});