angular.module('scrumDont.services', ['ngResource'])
  .factory("Project", function ($resource){
    return $resource('https://www.scrumdo.com/api/v2/organizations/telus3/projects/:slug');
  });
