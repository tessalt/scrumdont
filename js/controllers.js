angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, optionService) {
    $scope.message = 'Pick a project';
    $scope.loading = false;
  }).

  controller('OptionsController', function ($rootScope, $scope, projectService, iterationService, optionService) {

    $scope.options = optionService.getOptions();

    $scope.projects = projectService.query();

    $scope.iterations = $scope.options.project ? iterationService.query({project: $scope.options.project.slug}) : '';

    $scope.changeOptions = function(model) {
      if (model === 'project') {
        $scope.options.iteration = '';
      }
      $scope.options = optionService.setOptions($scope.options);
      $rootScope.$emit('optionsChanged');
    }

    $scope.clearOptions = function(prop) {
      var options = {};
      options[prop] = '';
      $scope.options = optionService.setOptions(options);
      $rootScope.$emit('optionsChanged');
    }

    $scope.changeFilter = function() {
      $scope.options = optionService.setOptions($scope.options);
      $rootScope.$emit('filtersChanged');
    }

    $scope.$watch('options.project',function(){
      if ($scope.options.project) {
        $scope.iterations = iterationService.query({project: $scope.options.project.slug});
      }
    }, true);

  }).

  controller('StoriesController', function ($rootScope, $scope, optionService, customStoryService) {

    $scope.filters = {};

    _showStories();

    $scope.$on('$destroy', function(){
      watchOptions();
      watchFilters();
    });

    $scope.exceptEmptyComparator = function (actual, expected) {
      if (!expected) {
         return true;
      }
      return angular.equals(expected, actual);
    }

    var watchOptions = $rootScope.$on('optionsChanged', function(){
      _showStories()
    });

    var watchFilters = $rootScope.$on('filtersChanged', function(){
      var options = optionService.getOptions();
      if (options.status) {
        $scope.filters.status = options.project.statuses.indexOf(options.status) + 1;
      } else {
        $scope.filters.status = '';
      }
    });

    function _showStories() {
      var options = optionService.getOptions();
      if (options.project) {
        var query = {
          project: options.project.slug,
          iteration: options.iteration.id,
          user: options.user.name
        }
        $scope.selectedUser = query.user;
        $scope.statuses = options.project.statuses;
        $scope.projectSlug = query.project;
        if (options.status) {
          $scope.filters.status = options.project.statuses.indexOf(options.status) + 1;
        }
        if (query.project) {
          $scope.message = '';
          $scope.loading = true;
          customStoryService.query(query).then(function(data){
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

  })