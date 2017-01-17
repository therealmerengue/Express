var app = angular.module('trackingApp');

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).hover(function() { //on mouseenter
                $(element).tooltip('show');
            }, function() {
                $(element).tooltip('hide'); //on mouseleave
            });
        }
    };
});

app.controller('sidePanelController', ['$scope', 'sidePanelService', function($scope, sidePanelService) {
    sidePanelService.extendPanel($scope);

    $scope.styles = [
        'http://localhost:3000/styles/style.json',
        'http://localhost:3000/styles/basic.json',
        'http://localhost:3000/styles/dark.json',
        'http://localhost:3000/styles/light.json',
        'http://localhost:3000/styles/street.json'
    ];

    $scope.setStyle = function(style) {
        $scope.$parent.map.setStyle(style);
    };

    $scope.toggleHide = function() {
        $scope.toggle();
        angular.element('#info-pane').scope().show(false);
    };

    $scope.stopTracking = function() {
        $scope.toggleHide();
        $scope.$parent.selectedPoint = null;
    };
}]);

app.controller('infoPanelController', ['$scope', 'sidePanelService', function($scope, sidePanelService) {
    sidePanelService.extendPanel($scope);
}]);


