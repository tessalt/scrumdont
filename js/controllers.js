angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, optionService) {
    $scope.message = 'Pick a project';
  }).

  controller('OptionsController', function ($rootScope, $scope, projectService, iterationService, optionService) {

    $scope.options = {
      project: JSON.parse(localStorage.getItem('project')) || '',
      user: JSON.parse(localStorage.getItem('user')) || '',
      iteration: JSON.parse(localStorage.getItem('iteration')) || ''
    }

    $scope.projects = projectService.query();

    if ($scope.options.project) {
      $scope.iterations = iterationService.query({project: $scope.options.project.slug});
    }

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

    $scope.$watch('options.project', function(){
      $scope.iterations = iterationService.query({project: $scope.options.project.slug});
    });

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
        user: options.user.username
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

  })