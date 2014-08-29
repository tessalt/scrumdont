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

  .factory('iterationStoryService', function ($resource){
    return $resource(scrumdoUrl + 'projects/:project/iterations/:iteration/stories/:story');
  })


  .factory('taskService', function ($resource) {
    return $resource(scrumdoUrl + 'projects/:project/stories/:story/tasks/:task');
  })

  .factory('customStoryService', function ($resource, $q, storyService, taskService, iterationStoryService) {

    var _getStoryResource = function(options) {
      if (options.iteration) {
        return iterationStoryService;
      } else {
        return storyService;
      }
    }

    function _getStoryAssignees(tasks) {
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
          var taskAssignees = _getStoryAssignees(tasks);
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

    function _getStoriesForUser(options, fn) {
      var storyResource = _getStoryResource(options);
      storyResource.query(options, function (stories){
        var promises = [];
        angular.forEach(stories, function (story){
          promises.push(_getTasksForStory(options.project, story));
        });
        $q.all(promises).then(function (promiseData){
          var storiesWithTasks = promiseData.filter(function (item){
            return item.tasks.length && item.assignees.indexOf(options.user) > -1;
          });
          fn(storiesWithTasks);
        });
      });
    }

    function _getStories(options) {
      var deferred = $q.defer();
      var storyResource = _getStoryResource(options);
      if (options.user) {
        _getStoriesForUser(options, function (storyData){
          deferred.resolve({stories: storyData});
        });
      } else {
        storyResource.query(options, function (data){
          deferred.resolve({stories: data});
        });
      }
      return deferred.promise;
    }

    return {
      getStories: _getStories
    }

  });