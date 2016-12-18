var app = angular.module('trackingApp');

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
}]);

app.controller('infoPanelController', ['$scope', function($scope) {
    $scope = sidePanelModule($scope);

    $scope.toggle = function() {
        $scope.checked = !$scope.checked;
    };
}]);


