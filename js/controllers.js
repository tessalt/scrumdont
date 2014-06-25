angular.module('scrumDont.controllers', []).

  controller('ScrumCtrl', function ($scope, Project) {

    $scope.member = localStorage.member;

    $scope.projectSlug = localStorage.projectSlug;
    
    Project.query(function(data){
      $scope.projects = data;  
    });

  });