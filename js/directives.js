app.directive('optionSelector', function ($document) {
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
    link: function(scope, element) {
      $document.on('click', function(e){
        var el = element[0];
        if (!el.contains(e.target)) {
          scope.$apply(function(){
            scope.showOptions = false;
          });
        }
      })
    },
    controller: function($scope) {
      $scope.toggleOptions = function() {
        $scope.showOptions = $scope.showOptions === true ? false : true;
      }
      $scope.selectItem = function(item) {
        $scope.model[$scope.attribute] = item;
        $scope.query = item.name;
        $scope.showOptions = false;
        $scope.change();
      }
      $scope.clearSelection = function() {
        $scope.model[$scope.attribute] = '';
        $scope.change();
      }
      $scope.clearInput = function() {
        $scope.query = '';
      }
    }
  }
});