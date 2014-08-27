angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, projectService, iterationService) {

    $scope.options = {
      project: JSON.parse(localStorage.getItem('project')) || '',
      user: JSON.parse(localStorage.getItem('user')) || '',
      iteration: JSON.parse(localStorage.getItem('iteration')) || ''
    }

    projectService.query(function(data){
      $scope.projects = data;
    });

    if ($scope.options.project) {
      iterationService.query({slug: $scope.options.project.slug}, function(data){
        $scope.iterations = data;
      });
    }

    $scope.setProject = function() {
      localStorage.setItem('project', JSON.stringify($scope.options.project));
      $scope.options.iteration = '';
      iterationService.query({slug: $scope.options.project.slug}, function(data){
        $scope.iterations = data;
      });
    }

    $scope.setUser = function() {
      localStorage.setItem('user', JSON.stringify($scope.options.user));
    }

    $scope.setIteration = function() {
      localStorage.setItem('iteration', JSON.stringify($scope.options.iteration));
    }

    $scope.getOptions = function() {
      console.log(JSON.parse(localStorage.getItem('options')));
    }

  });