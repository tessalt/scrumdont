var app = angular.module('scrumDont', ['scrumDont.controllers', 'scrumDont.services']);

app.directive('optionSelector', function() {
  return {
    restrict: 'EA',
    scope: {
      items: '=',
      model: '='
    },
    templateUrl: 'js/templates/option-selector.html',
    link: function(scope, element) {
      scope.chooseItem = function(){
        scope.model = this.item;
        angular.element(element[0].getElementsByTagName('ul')).css({
          'overflow': 'hidden',
          'height': '0px',
          'transitionProperty': 'height',
        });
      }
    }
  }
});