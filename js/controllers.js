angular.module('scrumDont.controllers', []).

  controller('AppController', function ($scope, optionService) {
    $scope.message = 'Pick a project';
  }).

  controller('OptionsController', function ($rootScope, $scope, projectService, iterationService, optionService) {

    $scope.options = optionService.getOptions();

    $scope.projects = projectService.query();

    $scope.iterations = $scope.options.project ? iterationService.query({project: $scope.options.project.slug}) : '';

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

    $scope.$watch('options.project',function(change){
      $scope.iterations = iterationService.query({project: $scope.options.project.slug});
    }, true);

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
        user: options.user.name
      }
      $scope.selectedUser = query.user;
      $scope.statuses = options.project.statuses;
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

  }).

  controller('TestController', function ($scope, optionService) {

    $scope.members = [
      {
        "name": "Jack O'Neill",
        "rank": "Colonel",
        "gender": "male",
        "species": "human"
      },
      {
        "name": "Samantha Carter",
        "rank": "Major",
        "gender": "Female",
        "species": "Human"
      },
      {
        "name": "Daniel Jackson",
        "rank": "Civilian",
        "gender": "Male",
        "species": "Human"
      },
      {
        "name": "Teal'c",
        "rank": "Civilian",
        "gender": "Male",
        "species": "Jaffa"
      }
    ];

    $scope.options =  {
      member: $scope.members[0]
    }

    $scope.stories = [
    {
        "completed_task_count": 0,
        "extra_1_html": "",
        "creator": {
            "username": "chrismt",
            "first_name": "Chris",
            "last_name": "Meddows-Taylor"
        },
        "number": 59,
        "rank": 630,
        "assignee": [],
        "id": 747802,
        "reorderResults": null,
        "category": "1 - Must",
        "has_external_links": false,
        "task_counts": [
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        "points_value": 3.0,
        "detail": "* TBD",
        "comment_count": 0,
        "points": "3",
        "has_attachment": true,
        "epic": {
            "local_id": 18,
            "id": 52533
        },
        "status": 1,
        "iteration_id": 107491,
        "detail_html": "<ul>\n<li>TBD</li>\n</ul>",
        "tags": "",
        "commits": [],
        "epic_label": "#E18",
        "task_count": 1,
        "extra_3_html": "",
        "extra_2_html": "",
        "extra_attributes": [],
        "created": "2014-06-23T14:51:40",
        "project_slug": "plans-add-ons",
        "summary_html": "<p>[NBA] As a TELUS customer, I would like to be able to select a subscriber to see the Offers / Messages for that one subscriber.</p>",
        "modified": "2014-08-22T16:49:46",
        "summary": "[NBA] As a TELUS customer, I would like to be able to select a subscriber to see the Offers / Messages for that one subscriber.",
        "estimated_minutes": 0,
        "tags_list": [],
        "status_text": "Todo",
        "extra_1": "",
        "extra_2": "",
        "extra_3": ""
    },
    {
        "completed_task_count": 0,
        "extra_1_html": "",
        "creator": {
            "username": "chrismt",
            "first_name": "Chris",
            "last_name": "Meddows-Taylor"
        },
        "number": 65,
        "rank": 639,
        "assignee": [],
        "id": 747813,
        "reorderResults": null,
        "category": "2 - Should",
        "has_external_links": false,
        "task_counts": [
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        "points_value": 3.0,
        "detail": "",
        "comment_count": 0,
        "points": "3",
        "has_attachment": true,
        "epic": {
            "local_id": 18,
            "id": 52533
        },
        "status": 1,
        "iteration_id": 107491,
        "detail_html": "",
        "tags": "",
        "commits": [],
        "epic_label": "#E18",
        "task_count": 1,
        "extra_3_html": "",
        "extra_2_html": "",
        "extra_attributes": [],
        "created": "2014-06-23T14:57:52",
        "project_slug": "plans-add-ons",
        "summary_html": "<p>[NBA] As a TELUS customer, I would like to be able to DELETE Service Messages that are of no interest to me or I am not interested in, so that my inbox is kept clean.</p>",
        "modified": "2014-08-22T16:50:10",
        "summary": "[NBA] As a TELUS customer, I would like to be able to DELETE Service Messages that are of no interest to me or I am not interested in, so that my inbox is kept clean.",
        "estimated_minutes": 0,
        "tags_list": [],
        "status_text": "Todo",
        "extra_1": "",
        "extra_2": "",
        "extra_3": ""
    },
    {
        "completed_task_count": 2,
        "extra_1_html": "",
        "creator": {
            "username": "chrismt",
            "first_name": "Chris",
            "last_name": "Meddows-Taylor"
        },
        "number": 39,
        "rank": 2500,
        "assignee": [
            {
                "username": "tthornton",
                "first_name": "",
                "last_name": "",
                "id": 56042
            }
        ],
        "id": 729334,
        "reorderResults": null,
        "category": "2 - Should",
        "has_external_links": false,
        "task_counts": [
            1,
            0,
            0,
            2,
            0,
            0,
            0,
            0,
            0,
            2
        ],
        "points_value": 5.0,
        "detail": "* If I am on an HSPA device, I will see an option to change my device type.\n* If I am on a CDMA device, I will not see an option to change my device type.\n* If the system does not know which device type I have, I will see the Select Device option immediately when beginning the Change Add-ons flow.\n* If I do not select a new device type, the default list of Add-ons will be for the device type that is already identified in the system as mine.\n* If I select a new device type, the compatible Add-ons for that device type will be displayed to me.\n\n---\n\nPhone types to include:\nSmartphone  (eg. Samsung Galaxy, HTC One)\niPhone\nBlackberry 10+\nBlackberry (2012 models and older)  (eg. Blackberry Curve, Bold)\nMobile phone\nMobile Internet (Internet key, Mobile Hotspot, Tablet, Smart Hub)",
        "comment_count": 4,
        "points": "5",
        "has_attachment": true,
        "epic": {
            "local_id": 6,
            "id": 52521
        },
        "status": 4,
        "iteration_id": 107491,
        "detail_html": "<ul>\n<li>If I am on an HSPA device, I will see an option to change my device type.</li>\n<li>If I am on a CDMA device, I will not see an option to change my device type.</li>\n<li>If the system does not know which device type I have, I will see the Select Device option immediately when beginning the Change Add-ons flow.</li>\n<li>If I do not select a new device type, the default list of Add-ons will be for the device type that is already identified in the system as mine.</li>\n<li>If I select a new device type, the compatible Add-ons for that device type will be displayed to me.</li>\n</ul>\n<hr />\n<p>Phone types to include:\nSmartphone  (eg. Samsung Galaxy, HTC One)\niPhone\nBlackberry 10+\nBlackberry (2012 models and older)  (eg. Blackberry Curve, Bold)\nMobile phone\nMobile Internet (Internet key, Mobile Hotspot, Tablet, Smart Hub)</p>",
        "tags": "",
        "commits": [],
        "epic_label": "#E6",
        "task_count": 5,
        "extra_3_html": "",
        "extra_2_html": "",
        "extra_attributes": [],
        "created": "2014-05-27T21:20:31",
        "project_slug": "plans-add-ons",
        "summary_html": "<p>[ADD-ONS] As a user who wants to buy an Add-on, I want to switch my device type (if not correct), so that I will see Add-ons that are compatible with my device.</p>",
        "modified": "2014-08-29T11:31:28",
        "summary": "[ADD-ONS] As a user who wants to buy an Add-on, I want to switch my device type (if not correct), so that I will see Add-ons that are compatible with my device.",
        "estimated_minutes": 0,
        "tags_list": [],
        "status_text": "Doing",
        "extra_1": "",
        "extra_2": "",
        "extra_3": ""
    }
];

    $scope.memberPicked = function() {
      console.log($scope.options.member);
    }

  })