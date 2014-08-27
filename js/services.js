var scrumdoUrl = 'https://www.scrumdo.com/api/v2/organizations/telus3/';

angular.module('scrumDont.services', ['ngResource'])

  .factory('projectService', function ($resource){
    return $resource(scrumdoUrl + 'projects/:slug');
  })

  .factory('iterationService', function ($resource) {
    return $resource(scrumdoUrl + 'projects/:slug/iterations/:iteration');
  });