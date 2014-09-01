angular.module('scrumDont.filters', []).

filter('status', function(){
  return function(input, two) {
    console.log(input);
    return input;
  }
})