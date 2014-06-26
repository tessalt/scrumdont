angular.module('scrumDont.controllers', []).

  controller('ScrumCtrl', function ($scope, Project, Tasks, $q) {

    Project.query(function(data){
      $scope.projects = data;
    });

    $scope.member = localStorage.member !== undefined ? JSON.parse(localStorage.member) : '';

    $scope.currentProject = localStorage.currentProject !== undefined ? JSON.parse(localStorage.currentProject) : '';

    $scope.optionsSet = false;

    $scope.saveOptions = function(currentProject, member) {
      if (member && currentProject) {
        localStorage['member'] = JSON.stringify(member);
        localStorage['currentProject'] = JSON.stringify(currentProject);
        $scope.optionsSet = true;
      }
    }

    if (typeof localStorage.stories !== 'undefined' && recentRefresh()) {
      $scope.stories = JSON.parse(localStorage.stories);
    } else {
      populateStories();
    }

    $scope.refresh = function() {
      localStorage['stories'] = '';
      $scope.stories = [];
      populateStories();
    }

    $scope.options = function() {
      chrome.tabs.create({'url': chrome.extension.getURL("options.html") } );
    }

    $scope.openStory = function(url) {
      chrome.tabs.create({'url': url});
    }

    function recentRefresh() {
      var now = new Date()
      var lastUpdate = new Date(localStorage.lastUpdate);
      ms = now.getTime() - lastUpdate.getTime();
      minutes = parseInt((ms/(1000*60))%60);
      if (minutes > 5) {
        return false;
      } else {
        return true;
      }
    }

    function populateStories() {
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
        localStorage['lastUpdate'] = new Date();
      });
    }

  });