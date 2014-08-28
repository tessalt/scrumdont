var scrumdoUrl = 'https://www.scrumdo.com/api/v2/organizations/telus3/';

angular.module('scrumDont.services', ['ngResource'])

  .factory('projectService', function ($resource){
    return $resource(scrumdoUrl + 'projects/:project');
  })

  .factory('iterationService', function ($resource) {
    return $resource(scrumdoUrl + 'projects/:project/iterations/:iteration');
  })

  .factory('storyService', function ($resource){
    var resourceConfig = {
      'query': {
        method: 'GET',
        transformResponse: function(data) {
          return angular.fromJson(data).items;
        },
        isArray: true
      }
    }
    return $resource(scrumdoUrl + 'projects/:project/stories/:story', {}, resourceConfig);
  })

  .factory('taskService', function ($resource) {
    return $resource(scrumdoUrl + 'projects/:project/stories/:story/tasks/:task');
  })

  .factory('customStoryService', function ($resource, $q, storyService, taskService) {

    function _getTaskAssignees(tasks) {
      var assignees = [];
      angular.forEach(tasks, function(task){
        if (task.assignee) {
          assignees.push(task.assignee.username);
        }
      });
      return assignees;
    }

    function _getTasksForStory(project, story) {
      var deferred = $q.defer();
      if (story.task_count > 0) {
        taskService.query({project: project, story: story.id}, function (tasks){
          var taskAssignees = _getTaskAssignees(tasks);
          tasks = {
            tasks: tasks,
            assignees: taskAssignees
          }
          var storyWithTasks = angular.extend(story, tasks);
          deferred.resolve(storyWithTasks);
        });
      } else {
        deferred.resolve({story: story, tasks: ''});
      }
      return deferred.promise;
    }

    function _getStoriesWithUser(project, user, fn) {
      storyService.query({project: project}, function (stories){
        var promises = [];
        angular.forEach(stories, function (story){
          promises.push(_getTasksForStory(project, story));
        });
        $q.all(promises).then(function (promiseData){
          var storiesWithTasks = promiseData.filter(function (item){
            return item.tasks.length && item.assignees.indexOf(user) > -1;
          });
          fn(storiesWithTasks);
        });
      });
    }

    function _getStories(options) {
      var deferred = $q.defer();
      if (options.user) {
        _getStoriesWithUser(options.project, options.user, function (storyData){
          deferred.resolve({stories: storyData});
        });
      } else {
        storyService.query({project: options.project}, function (data){
          deferred.resolve({stories: data});
        });
      }
      return deferred.promise;
    }

    return {
      getStories: _getStories
    }

  })

  .factory('optionService', function(){

    function _setOptions(options) {

      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          localStorage.setItem(prop, JSON.stringify(options[prop]));
        }
      }

    }

    function _getOptions() {
      return {
        project: JSON.parse(localStorage.getItem('project')) || '',
        user: JSON.parse(localStorage.getItem('user')) || '',
        iteration: JSON.parse(localStorage.getItem('iteration')) || ''
      }
    }

    function _getQuery() {
      var options = _getOptions();
      return {
        project: options.project.slug,
        user: options.user.username,
        iteration: options.iteration.id
      }
    }

    return {
      setOptions: _setOptions,
      getOptions: _getOptions,
      getQuery: _getQuery
    }
  })