angular.module('scrumDont.controllers', []).

  controller('ScrumCtrl', function ($scope, Project, Tasks, $q) {

    Project.query(function(data){
      $scope.projects = data;
    });

    $scope.member = localStorage.member !== undefined ? JSON.parse(localStorage.member) : '';

    $scope.currentProject = localStorage.currentProject !== undefined ? JSON.parse(localStorage.currentProject) : '';

    $scope.saveOptions = function(currentProject, member) {
      if (member && currentProject) {
        localStorage['member'] = JSON.stringify(member);
        localStorage['currentProject'] = JSON.stringify(currentProject);
      }
    }

    if (typeof localStorage.stories !== 'undefined') {
      $scope.stories = JSON.parse(localStorage.stories);
    } else {
      fetchTasks();
    }

    $scope.refresh = function() {
      $scope.stories = [];
      fetchTasks();
    }

    function fetchTasks() {
      Tasks.buildAll($scope.currentProject.slug).then(function (results){
        var taskArray = [];
        angular.forEach(results, function(result) {
          var sub = Tasks.findRelevant(result, $scope.member);
          if (typeof sub !== 'undefined') {
            taskArray.push(sub);
          }
        });
        $scope.stories = taskArray;
        localStorage['stories'] = JSON.stringify(taskArray);
      });
    }

  });