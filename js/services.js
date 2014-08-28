var scrumdoUrl = 'https://www.scrumdo.com/api/v2/organizations/telus3/';

angular.module('scrumDont.services', ['ngResource'])

  .factory('projectService', function ($resource){
    return $resource(scrumdoUrl + 'projects/:project');
  })

  .factory('iterationService', function ($resource) {
    return $resource(scrumdoUrl + 'projects/:project/iterations/:iteration');
  })

  .factory('storyService', function ($resource) {

    var resourceConfig = {
      'query': {
        method: 'GET',
        transformResponse: function(data) {
          return angular.fromJson(data).items;
        },
        isArray: true
      }
    }

    function getAll() {
      return $resource(scrumdoUrl + 'projects/:project/stories/:story', {}, resourceConfig);
    }

    function getStories(options) {
      if (options.user) {

      } else {
        return getAll;
      }
    }

    return getStories;

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