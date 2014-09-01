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

app.directive('storyLink', function ($document) {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/story-link.html',
    scope: {
      story: '=',
      statuses: '=',
      user: '@'
    },
    link: function(scope) {
      // console.log(scope.statuses[scope.story.status - 1]);
    },
    controller: function($scope) {
      $scope.openStory = function() {
        var url = 'https://www.scrumdo.com/projects/project/' +
                  $scope.story.project_slug + '/iteration/' +
                  $scope.story.iteration_id + '#story_' +
                  $scope.story.id;
        chrome.tabs.create({'url': url});
      }
      $scope.colors = ['red', 'pink', 'purple', 'indigo', 'teal', 'light-green', 'yellow', 'orange', 'deep-orange', 'brown', 'blue-grey'];
    }
  }
});