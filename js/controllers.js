angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, optionService) {

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

    $scope.loading = 'loading';

    var unbind = $rootScope.$on('optionsChanged', function(){
      $scope.loading = 'loading';
      var query = optionService.getQuery();
      customStoryService.query(query).then(function(data){
        $scope.stories = data.stories;
        $scope.loading = '';
      }, function(error){
        $scope.storiesError = error;
        $scope.loading = '';
      });
    });

    $scope.$on('$destroy', unbind);

  })