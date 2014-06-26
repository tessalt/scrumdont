var scrumDont = angular.module('scrumDont', [
  'ngResource',
  'scrumDont.services',
  'scrumDont.controllers'
  ]);

scrumDont.config(function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      'request': function(config) {
        $rootScope.$broadcast('loading-started');
        return config || $q.when(config);
      },
      'response': function(response) {
        $rootScope.$broadcast('loading-complete');
        return response || $q.when(response);
      }
    };
  });

});


scrumDont.directive("loadingIndicator", function() {
  return {
    restrict : "A",
    template: "<div></div>",
    link : function(scope, element, attrs) {
      scope.$on("loading-started", function(e) {
        element.css({"display" : ""});
      });

      scope.$on("loading-complete", function(e) {
        element.css({"display" : "none"});
      });

    }
  };
});

scrumDont.directive("storyLink", function() {
  return {
    restrict : "A",
    template: "<div>{{story.summary}}</div>",
    link : function(scope, element, attrs) {
      var url = "https://www.scrumdo.com/projects/project/" + scope.story.project_slug + "/iteration/" + scope.story.iteration_id + "#story_" + scope.story.id;
      element.on('click', function() {
        chrome.tabs.create({'url': url});
      });
    }
  };
});

scrumDont.directive('storyStatus', function(){
  return {
    restrict: 'A',
    template: '<span class="status {{textStatus}}">{{textStatus}}</span>',
    link: function(scope) {
      switch(scope.task.status) {
        case 1: 
          scope.textStatus = 'to-do';
          break;
        case 4: 
          scope.textStatus = 'doing';
          break;
        case 10:
          scope.textStatus = 'done';
          break;
      }
    }
  }
});