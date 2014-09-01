app.directive('optionSelector', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/option-selector.html',
    scope: {
      title: '@',
      model: '=',
      collection: '=',
      change: '&',
      attribute: '@'
    },
    controller: function($scope) {
      $scope.toggleOptions = function() {
        $scope.showOptions = $scope.showOptions === true ? false : true;
      }
      $scope.selectItem = function(item) {
        $scope.model[$scope.attribute] = item;
        $scope.showOptions = false;
        $scope.change();
      }
      $scope.clearSelection = function() {
        $scope.model[$scope.attribute] = '';
        $scope.change();
      }
    }
  }
});