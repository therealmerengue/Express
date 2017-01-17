var app = angular.module('trackingApp');

app.service('sidePanelService', function() {
    this.extendPanel = function(panel) {
        panel.checked = false;
        panel.size = '100px';
        panel.show = function(value) {
            panel.checked = value;
        };
        panel.toggle = function() {
            panel.checked = !panel.checked;
        };
        panel.toggleReset = function() {
            panel.toggle();
            panel.$parent.selectedPoint = null;
        };
    };
});