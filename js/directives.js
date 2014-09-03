angular.module('scrumDont.directives', ['ngSanitize'])

.directive('optionSelector', function ($document) {
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
        $scope.showOptions = false;
        $scope.change();
      }
      $scope.clearInput = function() {
        $scope.query = '';
      }
    }
  }
})

.directive('storyLink', function (commentsService, attachmentsService) {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/story-link.html',
    scope: {
      projectSlug: '@',
      story: '=',
      statuses: '=',
      user: '@'
    },
    link: function(scope, element) {
      var elWidth = element[0].querySelector('.story-contents').clientWidth;
      scope.setImgSize(elWidth/4);
    },
    controller: function($scope) {
      $scope.openStory = function() {
        $scope.showInfo = true;
        commentsService.query({story: $scope.story.id}, function(data){
          $scope.comments = data;
        });
        attachmentsService.query({project: $scope.projectSlug, story: $scope.story.id}, function(data){
          $scope.attachments = data;
        });
      }
      $scope.colors = ['red', 'pink', 'purple', 'indigo', 'teal', 'light-green', 'yellow', 'orange', 'deep-orange', 'brown', 'blue-grey'];
      $scope.setImgSize = function(width) {
        $scope.imgSize = width;
      }
    },
  }
})

.directive('storyThumbnail', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/story-thumb.html',
    scope: {
      image: '=',
      imgSize: '@'
    },
    link: function(scope) {
      console.log(scope.image)
    },
    controller: function($scope) {
      $scope.showFullImg = function() {
        chrome.tabs.create({'url': $scope.image.url});
      }
    }
  }
});