var scrumdoUrl = 'https://www.scrumdo.com/api/v2/organizations/telus3/';

angular.module('scrumDont.services', ['ngResource', 'ngCachedResource'])

  .factory('projectService', function ($resource, $cachedResource){
    var resourceConfig = {
      'getAll': {
        method: 'GET',
        transformResponse: function(data) {
          var transformed = angular.fromJson(data).map(function(item){
            var _members = item.members.map(function(member){
              member.name = member.username;
              return member;
            });
            var project = {
              id: item.id,
              members: _members,
              name: item.name,
              slug: item.slug,
              url: item.url,
              statuses: item.statuses
            }
            return project;
          });
          return transformed;
        },
        isArray: true
      }
    }
    return $cachedResource('project_store', scrumdoUrl + 'projects/:project', {id: '@id'}, resourceConfig);
  })

  .factory('iterationService', function ($resource, $cachedResource) {
    var resourceConfig = {
      'query': {
        method: 'GET',
        transformResponse: function(data) {
          var transformed = angular.fromJson(data).map(function(item){
            var iteration = {
              id: item.id,
              name: item.name
            }
            return iteration;
          });
          return transformed;
        },
        isArray: true
      }
    }
    return $cachedResource('iteration_store', scrumdoUrl + 'projects/:project/iterations/:iteration', {id: '@id'}, resourceConfig);
  })

  .factory('storyService', function ($resource, $cachedResource){
    var resourceConfig = {
      'query': {
        method: 'GET',
        transformResponse: function(data) {
          var items = angular.fromJson(data).items.map(function(item){
            var story = {
              id: item.id,
              summary: item.summary,
              task_count: item.task_count,
              number: item.number,
              status: item.status,
              iteration_id: item.iteration_id,
              project_slug: item.project_slug,
              category: item.category,
              created: new Date(item.created)
            }
            return story;
          });
          return items;
        },
        isArray: true
      }
    }
    return $cachedResource('story_store', scrumdoUrl + 'projects/:project/stories/:story', {id: '@id'}, resourceConfig);

  })

  .factory('iterationStoryService', function ($resource, $cachedResource){
    var resourceConfig = {
      'query': {
        method: 'GET',
        transformResponse: function(data) {
          var items = angular.fromJson(data).map(function(item){
            var story = {
              id: item.id,
              summary: item.summary,
              task_count: item.task_count,
              number: item.number,
              status: item.status,
              iteration_id: item.iteration_id,
              project_slug: item.project_slug,
              category: item.category,
              created: new Date(item.created)
            }
            return story;
          });
          return items;
        },
        isArray: true
      }
    }
    return $cachedResource('iteration_story_store', scrumdoUrl + 'projects/:project/iterations/:iteration/stories/:story', {id: '@id'}, resourceConfig);
  })

  .factory('attachmentsService', function ($resource, $cachedResource){
    var resourceConfig = {
      'query' : {
        method: 'GET',
        transformResponse: function(data) {
          var items = angular.fromJson(data).map(function(item){
            var filetype = item.filename.split('.').pop();
            item.imgtype = filetype === 'png' || filetype === 'jpg' ? true : false;
            return item;
          });
          return items;
        },
        isArray: true
      }
    }
    return $cachedResource('attachment_store', scrumdoUrl + 'projects/:project/stories/:story/attachments', {id: '@id'}, resourceConfig);
  })


  .factory('commentsService', function ($cachedResource) {
    var resourceConfig = {
      'query': {
        method: 'GET',
        transformResponse: function(data) {
          var items = angular.fromJson(data).map(function(item){
            var comment = item;
            comment.date = new Date(comment.date_submitted);
            return comment;
          });
          return items;
        },
        isArray: true
      }
    }
    return $cachedResource('comment_store', 'https://www.scrumdo.com/api/v2/comments/story/:story', {id: '@id'}, resourceConfig);
  })


  .factory('taskService', function ($resource, $cachedResource) {
    return $cachedResource('task_store', scrumdoUrl + 'projects/:project/stories/:story/tasks/:task', {id: '@id'});
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
          if (storyData.length) {
            deferred.resolve({stories: storyData});
          } else {
            deferred.reject('no stories');
          }
        });
      } else {
        storyResource.query(options, function (storyData){
          if (storyData.length) {
            deferred.resolve({stories: storyData});
          } else {
            deferred.reject('no stories');
          }
        });
      }
      return deferred.promise;
    }

    return {
      query: _getStories
    }

  })

  .factory('optionService', function(){

    function _setOptions(options) {

      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          localStorage.setItem(prop, JSON.stringify(options[prop]));
        }
      }

      return _getOptions();

    }

    function _getOptions() {
      return {
        project: JSON.parse(localStorage.getItem('project')) || '',
        user: JSON.parse(localStorage.getItem('user')) || '',
        iteration: JSON.parse(localStorage.getItem('iteration')) || '',
        status: JSON.parse(localStorage.getItem('status')) || ''
      }
    }

    function _getFilters() {
      return {
        status: JSON.parse(localStorage.getItem('status')) || ''
      }
    }

    return {
      setOptions: _setOptions,
      getOptions: _getOptions,
      getFilters: _getFilters
    }
  })