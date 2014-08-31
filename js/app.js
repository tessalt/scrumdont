var app = angular.module('scrumDont', ['scrumDont.controllers', 'scrumDont.services']);

app.directive('optionSelector', function() {
  return {
    restrict: 'EA',
    scope: {
      title: '@',
      items: '=',
      model: '=',
      selected: '&onSelected'
    },
    templateUrl: 'js/templates/option-selector.html',
    link: function(scope, element) {
      scope.chooseItem = function(item){
        scope.model = item;
        // scope.$apply();
      }
    }
  }
});