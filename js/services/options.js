angular.module('scrumDont.services', ['projectService'])

  .factory('optionService', function (projectService){

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