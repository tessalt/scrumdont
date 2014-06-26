angular.module('scrumDont.controllers', []).

  controller('ScrumCtrl', function ($scope, Project, Tasks, $q) {

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

    Tasks.buildAll($scope.currentProject.slug).then(function (results){
      var taskArray = [];
      angular.forEach(results, function(result) {
        var sub = Tasks.findRelevant(result, $scope.member);
        if (typeof sub !== 'undefined') {
          taskArray.push(sub);
        }
      });
      $scope.stories = taskArray;
    });


  });