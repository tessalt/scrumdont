angular.module('scrumDont.services', ['ngResource'])
  .factory("Project", function ($resource){
    return $resource('https://www.scrumdo.com/api/v2/organizations/telus3/projects/:slug');
  })
  .factory('Story', function ($resource) {
    return $resource('https://www.scrumdo.com/api/v2/organizations/telus3/projects/:slug/stories/:story', {}, {
      'query': {
        method: 'GET', 
        transformResponse: function(data) {
          return angular.fromJson(data).items;
        },
        isArray: true
      }
    });
  })
  .factory('Tasks', function ($resource, Story, $q, $http){
    var tasks = {};
    var fetchTasks = function(rawStory) {
      var deferred = $q.defer();
      $http({method: 'GET', url: 'https://www.scrumdo.com/api/v2/organizations/telus3/projects/' + rawStory.project_slug + '/stories/' + rawStory.id + '/tasks' }).success(function (tasks){              
        deferred.resolve({story: rawStory, tasks: tasks});
      });
      return deferred.promise;
    } 
    var filterTasks = function(task, member) {
      return task.complete === false && task.assignee && task.assignee.username === member;
    }
    tasks.findRelevant = function (item, member) {
      var hasTasks = false;
      item.story.taskArray = [];
      angular.forEach(item.tasks, function (task){
          console.log(task);
        if (filterTasks(task, member)) {
          hasTasks = true;
          item.story.taskArray.push(task);
        }
      });
      console.log(item.story.taskArray);
      if (hasTasks === true) {

        return item.story;
      }
    }
    tasks.buildAll = function (projectSlug) {
      var dfd = $q.defer();
      Story.query({slug: projectSlug}, function (rawStories) {
        var promises = [];
        angular.forEach(rawStories, function (rawStory){
          if (rawStory.task_count > 0) {
            promises.push(fetchTasks(rawStory));
          }
        });
        $q.all(promises).then(function(promiseData){
          dfd.resolve(promiseData);
        });
      });
      return dfd.promise;
    }
    return tasks;
  });
