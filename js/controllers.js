angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, optionService) {
    $scope.message = 'Pick a project';
  }).

  controller('OptionsController', function ($rootScope, $scope, projectService, iterationService, optionService) {

    $scope.options = optionService.getOptions();

    $scope.projects = projectService.query();

    $scope.iterations = $scope.options.project ? iterationService.query({project: $scope.options.project.slug}) : '';

    $scope.changeOptions = function(model) {
      if (model === 'project') {
        $scope.options.iteration = '';
      }
      $scope.options = optionService.setOptions($scope.options);
      $rootScope.$emit('optionsChanged');
    }

    $scope.clearOptions = function(prop) {
      var options = {};
      options[prop] = '';
      $scope.options = optionService.setOptions(options);
      $rootScope.$emit('optionsChanged');
    }

    $scope.$watch('options.project',function(change){
      $scope.iterations = iterationService.query({project: $scope.options.project.slug});
    }, true);

  }).

  controller('StoriesController', function ($rootScope, $scope, optionService, customStoryService) {


    _showStories();

    var unbind = $rootScope.$on('optionsChanged', function(){
      _showStories()
    });

    function _showStories() {
      var options = optionService.getOptions();
      var query = {
        project: options.project.slug,
        iteration: options.iteration.id,
        user: options.user.name
      }
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
    }

    $scope.$on('$destroy', unbind);

  }).

  controller('TestController', function ($scope, optionService) {

    $scope.members = [
      {
        "name": "Jack O'Neill",
        "rank": "Colonel",
        "gender": "male",
        "species": "human"
      },
      {
        "name": "Samantha Carter",
        "rank": "Major",
        "gender": "Female",
        "species": "Human"
      },
      {
        "name": "Daniel Jackson",
        "rank": "Civilian",
        "gender": "Male",
        "species": "Human"
      },
      {
        "name": "Teal'c",
        "rank": "Civilian",
        "gender": "Male",
        "species": "Jaffa"
      }
    ];

    $scope.member = $scope.members[0];

    $scope.memberPicked = function() {
      console.log($scope.member);
    }

  })