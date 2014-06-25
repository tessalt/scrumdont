angular.module('scrumDont.controllers', []).

  controller('ScrumCtrl', function ($scope, Project) {

    $scope.member = localStorage.member !== undefined ? JSON.parse(localStorage.member) : '';

    $scope.currentProject = localStorage.currentProject !== undefined ? JSON.parse(localStorage.currentProject) : '';

    $scope.saveOptions = function(currentProject, member) {
      if (member && currentProject) {
        localStorage['member'] = JSON.stringify(member);
        localStorage['currentProject'] = JSON.stringify(currentProject);
      }
    }
    
    Project.query(function(data){
      $scope.projects = data;  
    });

  });