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

.directive('storyItem', function (commentsService, attachmentsService, $sce) {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/story-item.html',
    scope: {
      projectSlug: '@',
      story: '=',
      statuses: '=',
      user: '@'
    },
    link: function(scope, element) {
      var cardWidth = element[0].querySelector('.story-attachments').clientWidth;
      scope.setImgSize((cardWidth - 24) / 5 );
    },
    controller: function($scope) {
      $scope.storyDetails = $sce.trustAsHtml($scope.story.detail);
      $scope.openStory = function() {
        if (!$scope.showInfo) {
          commentsService.query({story: $scope.story.id}, function(data){
            $scope.comments = data;
          });
          attachmentsService.query({project: $scope.projectSlug, story: $scope.story.id}, function(data){
            $scope.attachments = data;
          });
          $scope.showInfo = true;
        } else {
          $scope.showInfo = false;
        }
      }
      $scope.colors = ['red', 'pink', 'purple', 'indigo', 'teal', 'light-green', 'yellow', 'orange', 'deep-orange', 'brown', 'blue-grey'];
      $scope.setImgSize = function(width) {
        $scope.imgSize = width;
      }
      $scope.url = 'https://www.scrumdo.com/projects/project/' +
                  $scope.story.project_slug + '/iteration/' +
                  $scope.story.iteration_id + '#story_' +
                  $scope.story.id;
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
      // console.log(scope.image)
    },
    controller: function($scope) {
      $scope.modalShown = false;
      $scope.showFullImg = function() {
        $scope.modalShown = !$scope.modalShown;
        console.log('$scope.modalShown');
      };
    }
  }
});

app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: 'js/templates/modal-dialog.html' // See below
  };
});

app.directive('storyList', function (customStoryService, optionService, $rootScope, storySearchService, $q) {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/story-list.html',
    controller: function($scope) {
      $scope.filters = {};
      var fetchStories = function() {
        var options = optionService.getOptions();
        if (options.project) {
          $scope.query = {
            project: options.project.slug,
            iteration: options.iteration.id,
            user: options.user.name
          }
          $scope.statuses = options.project.statuses;
          $scope.categories = options.project.categories;
          if (options.status) {
            $scope.filters.status = options.project.statuses.indexOf(options.status) + 1;
          }
          if (options.category) {
            $scope.filters.category = options.category;
          }
          if ($scope.query.project) {
            $scope.message = '';
            $scope.loading = true;
            customStoryService.query($scope.query).then(function(data){
              $scope.stories = data.stories;
              $scope.loading = false;
            }, function(error){
              $scope.stories = [];
              $scope.message = error;
              $scope.loading = false;
            });
          }
        }
      }
      var searchStories = function(query) {
        $scope.loading = true;
        storySearchService.query({project: $scope.options.project.slug}, {q: query}, function (data) {
          if (data.items.length) {
            var promises = [];
            angular.forEach(data.items, function (story){
              promises.push(customStoryService.getTasks($scope.options.project.slug, story));
            });
            $q.all(promises).then(function (promiseData){
              $scope.filters.categroy = '';
              $scope.filters.status = '';
              $scope.loading = false;
              $scope.stories = promiseData;
            }, function() {
              $scope.loading = false;
              $scope.message = 'No matches';
            });
          } else {
            $scope.loading = false;
            $scope.message = 'No matches';
          }
        });
      }
      fetchStories();
      $rootScope.$on('optionsChanged', function(e) {
        fetchStories();
      });
      $rootScope.$on('searchSubmitted', function() {
        var searchString = optionService.getSearchString();
        if (searchString.length) {
          searchStories(searchString);
        } else {
          fetchStories();
        }
      });
      $rootScope.$on('filtersChanged', function(){
        var options = optionService.getOptions();
        if (options.status) {
          $scope.filters.status = options.project.statuses.indexOf(options.status) + 1;
        } else {
          $scope.filters.status = '';
        }
        if (options.category) {
          $scope.filters.category = options.category;
        } else {
          $scope.filters.category = '';
        }
      });
      $scope.exceptEmptyComparator = function (actual, expected) {
        if (!expected) {
           return true;
        }
        return angular.equals(expected, actual);
      }
    }
  }
});

app.directive('refreshIcon', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/refresh-icon.html'
  }
});

app.directive('searchIcon', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/search-icon.html'
  }
});

app.directive('closeIcon', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/close-icon.html'
  }
});

app.directive('searchInput', function ($rootScope, optionService) {
  return {
    restrict: 'E',
    templateUrl: 'js/templates/search-input.html',
    scope: {
      toggle: '='
    },
    link: function (scope, el) {
      scope.$watch('toggle', function() {
        if (scope.toggle) {
          el[0].querySelector('input').focus();
        }
      }, true);
    },
    controller: function ($scope) {
      $scope.query = '';
      $scope.search = function () {
        optionService.setSearchString($scope.query);
        $rootScope.$emit('searchSubmitted');
      }
    }
  }
});