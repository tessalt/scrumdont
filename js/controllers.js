angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, optionService) {
    $scope.message = 'Pick a project';

  }).

  controller('OptionsController', function ($rootScope, $scope, projectService, iterationService, optionService) {

    $scope.options = {
      project: JSON.parse(localStorage.getItem('project')) || '',
      user: JSON.parse(localStorage.getItem('user')) || '',
      iteration: JSON.parse(localStorage.getItem('iteration')) || ''
    }

    projectService.query(function(data){
      $scope.projects = data;
    });

    if ($scope.options.project) {
      // $scope.message = '';
      iterationService.query({project: $scope.options.project.slug}, function(data){
        $scope.iterations = data;
      });
    }

    $scope.changeProject = function() {
      optionService.setOptions({
        project: $scope.options.project,
        iteration: ''
      })
      iterationService.query({project: $scope.options.project.slug}, function(data){
        $scope.iterations = data;
      });
      $scope.query = optionService.getQuery();
    }

    $scope.changeOptions = function() {
      optionService.setOptions({
        iteration: $scope.options.iteration,
        user: $scope.options.user
      });
      $scope.query = optionService.getQuery();
    }

    $scope.clearOptions = function(prop) {
      var options = {};
      options[prop] = '';
      console.log(prop);
      optionService.setOptions(options);
      $scope.query = optionService.getQuery();
    }

    $scope.$watch('query', function(){
      $rootScope.$emit('optionsChanged');
    });

  }).

  controller('StoriesController', function ($rootScope, $scope, optionService, customStoryService) {

    var unbind = $rootScope.$on('optionsChanged', function(){
      var query = optionService.getQuery();
      $scope.selectedUser = query.user;
      if (query.project) {
        $scope.message = 'loading';
        customStoryService.query(query).then(function(data){
          $scope.stories = data.stories;
          $scope.message = '';
        }, function(error){
          $scope.stories = [];
          $scope.message = error;
        });
      }
    });

    $scope.$on('$destroy', unbind);

  })