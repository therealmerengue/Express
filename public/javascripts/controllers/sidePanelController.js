var app = angular.module('trackingApp');

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

function sidePanelModule(obj) {
    obj.checked = false;
    obj.size = '100px';
    obj.show = function(value) {
        obj.checked = value;
    };
    obj.mockRouteChange = function () {
        obj.$broadcast('$locationChangeStart');
    };
    return obj;
}

app.controller('sidePanelController', ['$scope', function($scope) {
    $scope = sidePanelModule($scope);

    $scope.toggle = function() {
        $scope.checked = !$scope.checked;
        angular.element('#info-pane').scope().show(false);
    };

    $scope.toggleReset = function() {
        $scope.toggle();
        $scope.$parent.selectedPoint = null;
    };
}]);

app.controller('infoPanelController', ['$scope', function($scope) {
    $scope = sidePanelModule($scope);

    $scope.toggle = function() {
        $scope.checked = !$scope.checked;
    };
    $scope.stopTracking = function() {
        $scope.toggle();
        $scope.$parent.selectedPoint = null;
    };
}]);


