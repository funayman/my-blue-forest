var app = angular.module('myBlueForest', ['ui.router', 'ui.bootstrap', 'hc.marked', 'ngFlash', 'ngTagsInput', 'ngSanitize']);

app.run(['UserService', function(UserService) {
  UserService.init();
}]);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.defaults.withCredentials = true;

  var isAuthorized = function(UserService, $q, $state, $timeout) {
    return UserService.isAuthenticated().then(function(response) {
      return response;
    }, function() {
      $timeout(function() { $state.go('login', {flashMessage:{style:'danger', msg:'You must be logged in to view this page'}}, {reload:true}); });
    });
    //if(UserService.isAuthenticated()) { return $q.when(); }
    //else { $timeout(function() { $state.go('login', {flashMessage:{style:'danger', msg:'You must be logged in to view this page'}}, {reload:true}); }); }
  };

  var states = [
    {
      name: 'index',
      url: '/',
      controller: 'ViewPostsController as ctrl',
      templateUrl: '/components/view-posts.html',
      resolve: {
        posts: function(PostService) {
          return PostService.getAll();
        },
        following: function(UserService) {
          var fnEmpty = function() { return []; };
          return UserService.isAuthenticated()
          .then(function(response) {
            return UserService.getFollowedPosts()
            .then(function(response) { return response.data; }, fnEmpty);
          }, fnEmpty)
          .then(function(followedPosts) {
            var ids = [];
            followedPosts.forEach(function(p) {
              ids.push(p.id);
            });
            return ids;
          });
        },
        followingCount: function(PostService) {
          return PostService.getFollowCount().then(function(response) { return response.data; });
        },
        likedPosts: function(UserService) {
          return UserService.getLikedPostIDs().then(function(response) { return response.data; });
        },
        ratings: function(RatingService) {
          return RatingService.getAll().then(function(response) { return response.data; });
        },
        title: function() { return "Most Recent Posts"; },
        noPostMessage: function() { return "Uh oh no posts!"; }
      },
      params: { flashMessage: null }
    },
    {
      name: 'following',
      url: '/following',
      controller: 'ViewPostsController as ctrl',
      templateUrl: '/components/view-posts.html',
      resolve: {
        auth: isAuthorized,
        posts: function(UserService) {
          return UserService.getFollowedPosts().then(function(response) { return response.data; });
        },
        followingCount: function(PostService) {
          return PostService.getFollowCount().then(function(response) { return response.data; });
        },
        following: function(UserService) {
          var fnEmpty = function() { return []; };
          return UserService.getFollowedPosts().then(function(response) { return response.data; }, fnEmpty)
          .then(function(followedPosts) {
            var ids = [];
            followedPosts.forEach(function(p) {
              ids.push(p.id);
            });
            return ids;
          });
        },
        likedPosts: function(UserService) {
          return UserService.getLikedPostIDs().then(function(response) { return response.data; });
        },
        ratings: function(RatingService) {
          return RatingService.getAll().then(function(response) { return response.data; });
        },
        title: function() { return "Posts You Are Following"; },
        noPostMessage: function() { return "You are currently not following any posts"; }
      }
    },
    {
      name: 'contribute',
      url: '/post/new',
      controller: 'CreatePostController as ctrl',
      templateUrl: '/components/create-post.html',
      resolve: {
        auth: isAuthorized
      }
    },
    {
      name: 'post',
      url: '/post/{pid}',
      controller: 'ViewSinglePostController as ctrl',
      templateUrl: '/components/view-post.html',
      params: { flashMessage:null },
      resolve: {
        post: function(PostService, $transition$) {
          return PostService.getPost($transition$.params().pid).then(function(response) { return response.data; });
        },
        comments: function(PostService, $transition$) {
          return PostService.getComments($transition$.params().pid).then(function (response) { return response.data; });
        },
        isFollowing: function(PostService, $transition$) {
          return PostService.isFollowing($transition$.params().pid).then(function(response) {
            return response.data;
          });
        },
        ratingData: function(RatingService, $transition$) {
          return RatingService.getAverage($transition$.params().pid).then(function(response) { return response.data; });
        },
        doesLike: function(PostService, UserService, $transition$) {
          var fnReturnFalse = function(response) { return false; };
          return UserService.isAuthenticated()
          .then(function(response) { return PostService.doesLikePost($transition$.params().pid, UserService.getUsername()); }, fnReturnFalse)
          .then(function(response) { return response.data; }, fnReturnFalse);
        }

      }
    },
    {
      name: 'postEdit',
      url: '/post/{pid}/edit',
      controller: 'EditPostController as ctrl',
      templateUrl: '/components/create-post.html',
      resolve: {
        auth: isAuthorized,
        post: function(PostService, UserService, $transition$, $state, $timeout, $q) {
          return PostService.getPost($transition$.params().pid).then(function(response) {
            var p = response.data;
            if(p.owner.username === UserService.getUsername()) {
              return p;
            } else {
              $timeout(function() { $state.go('index', {flashMessage:{style:'danger', msg:'You are not authorized to edit this post'}}, {reload:true}); });
            }
          });
        }

      }
    },
    {
      name: 'tagPosts',
      url: '/tag/{name}',
      controller: 'ViewPostsController as ctrl',
      templateUrl: '/components/view-posts.html',
      resolve: {
        posts: function(TagService, $transition$, $timeout, $state) {
          return TagService.getPosts($transition$.params().name).then(function(response){
            return response.data;
          }, function(response){
            console.log(response);
            $timeout(function() { $state.go('index', {flashMessage:{style:'warning', msg:'tag [' + $transition$.params().name + '] does not exist'}}, {reload:true}); });
          });
        },
        followingCount: function(PostService) {
          return PostService.getFollowCount().then(function(response) { return response.data; });
        },
        following: function(UserService) {
          var fnEmpty = function() { return []; };
          return UserService.isAuthenticated()
          .then(function(response) {
            return UserService.getFollowedPosts()
            .then(function(response) { return response.data; }, fnEmpty);
          }, fnEmpty)
          .then(function(followedPosts) {
            var ids = [];
            followedPosts.forEach(function(p) {
              ids.push(p.id);
            });
            return ids;
          });
        },
        likedPosts: function(UserService) {
          return UserService.getLikedPostIDs().then(function(response) { return response.data; });
        },
        ratings: function(RatingService) {
          return RatingService.getAll().then(function(response) { return response.data; });
        },
        title: function($transition$) { return 'Posts with "' + $transition$.params().name + '" tag'; },
        noPostMessage: function() { return 'There are currently no posts with that tag'; }
      }
    },
    {
      name: 'register',
      url: '/register',
      controller: 'RegistrationController as ctrl',
      templateUrl: '/components/create-user.html',
    },
    {
      name: 'login',
      url: '/login',
      controller: 'LoginController as ctrl',
      templateUrl: '/components/login.html',
      params: { flashMessage: null }
    },
    {
      name: 'logout',
      url: '/logout',
      resolve: {
        yaru: function(UserService, $state, $timeout) {
          var f = function(data) {
            UserService.setAuth(false, null);
            $timeout(function() { $state.transitionTo('index', {flashMessage:{style:'success', msg:'You were successfully logged out'}}, {reload: true}); });
          };

          return UserService.logout().then(f,f);
        }
      }
    },
    {
      name: 'user',
      url: '/user/{username}',
      controller: 'ViewUserController as ctrl',
      templateUrl: '/components/view-user.html',
      params: { flashMessage: null },
      resolve: {
        user: function($timeout, $transition$, $state, UserService) {
          var username = $transition$.params().username;
          return UserService.getUser(username).then(function(response) {
            return response.data;
          }, function(response) {
            console.log(response);
            $timeout(function() { $state.transitionTo('index', {flashMessage:{style:'warning', msg:'That user does not exist'}}, {reload: true}); });
          });
        },
        posts: function($transition$, UserService) {
          var username = $transition$.params().username;
          return UserService.getPosts(username).then(function(response) {
            return response.data;
          }, function() { return []; });
        }
      }
    },
    {
      name: 'me',
      url: '/me',
      controller: 'UpdateUserController as ctrl',
      templateUrl: '/components/update-user.html',
      params: { flashMessage: null },
      resolve: {
        auth: isAuthorized,
        user: function($transition$, $timeout, $state, UserService) {
          return UserService.getMe().then(function(response) {
            return response.data;
          });
        },
        posts: function(UserService) {
          return UserService.getPosts(UserService.getUsername()).then(function(response) {
            return response.data;
          }, function() { return []; });
        }
      }
    }

  ];

  states.forEach(function(state) { $stateProvider.state(state); });

  $urlRouterProvider.otherwise('/');   //catch all for other than definded
});

app.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

//https://blog.brunoscopelliti.com/angularjs-directive-to-check-that-passwords-match/
//https://stackoverflow.com/questions/33191741/password-match-angularjs-validation
app.directive('pwCheck', [function() {
  var link = function($scope, $element, $attrs, ctrl) {
    var validate = function(viewValue) {
      var comparisonModel = $attrs.pwCheck;
      //console.log(viewValue + ':' + comparisonModel);

      if(!viewValue || !comparisonModel){
        // It's valid because we have nothing to compare against
        ctrl.$setValidity('pwmatch', true);
      }

      // It's valid if model is lower than the model we're comparing against
      ctrl.$setValidity('pwmatch', viewValue === comparisonModel );
      return viewValue;
    };

    ctrl.$parsers.unshift(validate);
    ctrl.$formatters.push(validate);

    $attrs.$observe('pwCheck', function(comparisonModel){
      return validate(ctrl.$viewValue);
    });

  };

  return {
    require: 'ngModel',
    link: link
  };
}]);

// https://gist.githubusercontent.com/jeffjohnson9046/9789876/raw/6e96dd87745ed9b319ae53c42c2f207747411313/title-case-filter.js
app.filter('titlecase', function() {
  return function (input) {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

    input = input.toLowerCase();
    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
      if (index > 0 && index + match.length !== title.length &&
        match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
        (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
        title.charAt(index - 1).search(/[^\s-]/) < 0) {
          return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
          return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
      });
    };
  });


  //modified from https://gist.github.com/lukevella/f23423170cb43e78c40b
  app.filter('elapsed', function(){
      return function(timeOfThing){
          if (!timeOfThing) return;
          var time = new Date(0);
          time.setMilliseconds(timeOfThing);
          var timeNow = new Date().getTime(),
              difference = timeNow - time,
              seconds = Math.floor(difference / 1000),
              minutes = Math.floor(seconds / 60),
              hours = Math.floor(minutes / 60),
              days = Math.floor(hours / 24);
          if (days > 1) {
              return days + " days ago";
          } else if (days == 1) {
              return "1 day ago";
          } else if (hours > 1) {
              return hours + " hours ago";
          } else if (hours == 1) {
              return "an hour ago";
          } else if (minutes > 1) {
              return minutes + " minutes ago";
          } else if (minutes == 1){
              return "a minute ago";
          } else {
              return "a few seconds ago";
          }
      };
  });
