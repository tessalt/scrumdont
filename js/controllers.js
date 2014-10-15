angular.module('scrumDont.controllers', ['ngCachedResource']).

  controller('AppController', function ($scope, optionService, $cachedResource, $rootScope, $document,  projectService, iterationService, storySearchService) {
    $scope.message = 'Pick a project';
    $scope.loading = false;
    $scope.showSearch = false;
    $scope.searchQuery = '';

    $scope.clearCache = function() {
      $cachedResource.clearCache();
      $rootScope.$emit('optionsChanged');
    }

    $scope.toggleSearch = function() {
      $scope.showSearch = !$scope.showSearch;
    }

    $scope.options = optionService.getOptions();

    $scope.projects = projectService.getAll();

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

  });