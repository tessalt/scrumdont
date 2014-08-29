angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, projectService, iterationService) {


  }).

  controller('OptionsController', function ($scope, projectService, iterationService, optionService) {

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

    $scope.query = optionService.getQuery();

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

    $scope.changeUser = function(){
      optionService.setOptions({user: $scope.options.user});
      $scope.query = optionService.getQuery();
    }

    $scope.changeIteration = function(){
      optionService.setOptions({iteration: $scope.options.iteration});
      $scope.query = optionService.getQuery();
    }

  }).

  controller('StoriesController', function ($scope, optionService, customStoryService){

    var query = optionService.getQuery();

    customStoryService.getStories(query).then(function(data){
      $scope.stories = data.stories;
      console.log(data);
    });

  })