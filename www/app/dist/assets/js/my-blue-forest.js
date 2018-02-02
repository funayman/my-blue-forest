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

app.controller('ViewPostsController', function(
    Flash, $state, marked,
    PostService, UserService,
    posts, following, followingCount, likedPosts, ratings, title, noPostMessage
  ) {
  var self = this;
  ratings = ratings || []; //fix if empty from API

  //show flash message
  if($state.params.flashMessage) {
    var fm = $state.params.flashMessage;
    Flash.create(fm.style, fm.msg, 3500);
  }

  //merge posts and following count and user
  posts.forEach(function(post) {
    post.following = { count: 0, is: false };
    post.rating = 0;

    post.description = PostService.filterDesc(post.description);

    //find count number
    for(i=0; i<followingCount.length; i++) {
      if(followingCount[i].pid === post.id) {
        post.following.count = followingCount[i].count;
        break;
      }
    }

    //find if user is following
    if(following.includes(post.id)) {
      post.following.is = true;
    }

    //add ratings
    for(i=0; i<ratings.length; i++) {
      if(ratings[i].pid === post.id) {
        post.rating = ratings[i].rating;
      }
    }
  });

  self.emptyMsg = noPostMessage;

  self.posts = posts;
  self.title = title;
  self.following = following;
  self.likedPosts = likedPosts || [];

  //used for sorting
  self.sortType = 'date';   //sort by newly created by default
  self.sortReverse = true;  //invert the sort order?
  self.searchPost = '';     //holds the term to search through posts
  self.filterType = '';     //by default show all posts

  self.doFollowing = function(pid) {
    var err = function(response) { console.log(response); };
    var i = null;

    self.posts.forEach(function(post, index) {
      if(post.id == pid) {
        i = index;
        return;
      }
    });

    var bool = !self.posts[i].following.is;

    PostService.setFollowing(pid, bool).then(function() {
      self.posts[i].following.is = bool;
      if(bool) {
        self.posts[i].following.count++;
      } else {
        self.posts[i].following.count--;
      }

    },err);

  };

  self.doLike = function(pid) {
    var err = function(response) { console.log(response); };
    UserService.isAuthenticated().then(function(reponse) {
      var i = null;

      self.posts.forEach(function(post, index) {
        if(post.id == pid) {
          i = index;
          return;
        }
      });

      var bool = !self.likedPosts.includes(pid);
      PostService.like(pid, bool).then(function(response) {
        if(bool) {
          self.posts[i].likesCount++;
          self.likedPosts.push(pid);
        } else {
          self.posts[i].likesCount--;
          self.likedPosts.splice(self.likedPosts.indexOf(pid), 1);
        }
      }, err);
    }, err);
  };

  self.getStarRange = function(avg) {
    var arr = Array(Math.floor(avg));
    for(i=0; i<arr.length; i++) {
      arr[i] = i;
    }
    return arr;
  };

});

app.controller('CreatePostController', ['$state', 'PostService', 'TagService',  function($state, PostService, TagService) {
  var self = this;

  self.showPreview = false;
  self.submitted = false;
  self.postTypes = [
    {
      id: "G",
      name: "General",
      value: "GENERAL",
    },
    {
      id: "Q",
      name: "Question",
      value: "QUESTION",
    },
    {
      id: "A",
      name: "Advice",
      value: "ADVICE",
    },
    {
      id: "R",
      name: "Review",
      value: "REVIEW",
    }
  ]; //postTypes
  self.formData = {
    description: '*You* **can** use [markdown](https://guides.github.com/features/mastering-markdown/) when you make your description',
    type: self.postTypes[0].value,  //type init by default to remove blank select option
    tags: [] //needed to show help-block on page load
  };

  self.loadTags = function(query) {
    return TagService.getAll().then(function(response){
      return response.data.filter(function(tag) {
        return tag.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
      });
    });
  };

  self.processForm = function() {
    TagService.processTags(self.formData.tags).then(function(response) {
      return response.data;
    }).then(function(tags) {
      self.formData.tags = tags;
      return PostService.create(self.formData);
    }).then(function(response) {
      if(self.fileToUpload != null) {
        var post = response.data;
        var imgData = new FormData();
        imgData.append('file', self.fileToUpload);
        return PostService.uploadImg(post.id, imgData);
      } //end if
    }).then(function(response) {
      console.log(response);
      $state.transitionTo('index', {flashMessage:{style:'success', msg:'Post successfully created!'}}, {reload: true});
    });
  };

}]);

app.controller('EditPostController', ['$state', 'PostService', 'TagService', 'post', function($state, PostService, TagService, post) {
  var self = this;

  self.showPreview = false;
  self.submitted = false;
  self.postTypes = [
    {
      id: "G",
      name: "General",
      value: "GENERAL",
    },
    {
      id: "Q",
      name: "Question",
      value: "QUESTION",
    },
    {
      id: "A",
      name: "Advice",
      value: "ADVICE",
    },
    {
      id: "R",
      name: "Review",
      value: "REVIEW",
    }
  ]; //postTypes
  self.formData = {
    id: post.id,
    title: post.title,
    type: self.postTypes[ self.postTypes.findIndex(function(type) { return type.value === post.type; }) ].value,
    description: post.description,
    assetUrl: post.assetUrl,
    tags: post.tags
  };
  self.asset = post.assetUrl;


  self.loadTags = function(query) {
    return TagService.getAll().then(function(response){
      return response.data.filter(function(tag) {
        return tag.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
      });
    });
  };

  self.processForm = function() {
    TagService.processTags(self.formData.tags).then(function(response) {
      return response.data;
    }).then(function(tags) {
      self.formData.tags = tags;
      return PostService.update(self.formData);
    }).then(function(response) {
      if(self.fileToUpload != null) {
        var post = response.data;
        var imgData = new FormData();
        imgData.append('file', self.fileToUpload);
        return PostService.uploadImg(post.id, imgData);
      } //end if
    }).then(function(response) {
      console.log(response);
      $state.transitionTo('post', { pid:post.id, flashMessage:{style:'success', msg:'Updated Successfully'}}, {reload: true});

    });
  };

}]);

app.controller('LoginController', ['$state', 'Flash', 'UserService', function($state, Flash, UserService) {
  var self = this;
  self.cred = {};

  if($state.params.flashMessage) {
    var fm = $state.params.flashMessage;
    Flash.create(fm.style, fm.msg, 3500);
  }

  self.submitLogin = function() {
    var username = self.cred.u;
    var password = self.cred.p;

    UserService.login(username, password).then(function(data){
      UserService.setAuth(true, username);
      $state.transitionTo('index', {flashMessage:{style:'success', msg:'Successful login! Welcome!'}}, {reload: true});
    }, function(data){
      var msgFail = '<strong>Uh oh!</strong> There was a problem with the credentials you provided';
      var id = Flash.create('danger', msgFail, 2000, {class:'custom-flash'}, true);
      console.log(data);
    });
  };

}]);


app.controller('RegistrationController', ['$state', 'UserService', 'PostalService', function($state, UserService, PostalService) {
  var self = this;

  //validate the first three digits of form input
  self.onYuuChange = function() {
    PostalService.doesRegionExist(self.reg.region.yuu).then(function(data){
      //console.log(data, self.reg.region.yuu);
      if(data) {
        self.registrationForm.yuu.$setValidity('validRegion', true);
        self.onBinChange();
      } else {
        self.registrationForm.yuu.$setValidity('validRegion', false);
      }
    }, function() {
        self.registrationForm.yuu.$setValidity('validRegion', false);
    });
  };

  self.onBinChange = function() {
    if( self.registrationForm.yuu.$valid ) {
      PostalService.getRegionData(self.reg.region.yuu, self.reg.region.bin).then(function(data) {
        self.registrationForm.bin.$setValidity('validRegion', true);
        //console.log(data);
      }, function(response) {
        //console.log(response);
        self.registrationForm.bin.$setValidity('validRegion', false);
      });
    }
  };

  self.submitRegistration = function() {
    self.reg.err = {};
    PostalService.getRegionData(self.reg.region.yuu, self.reg.region.bin).then(function(data){
      return {
        postCode: data.post_code,
        prefecture: data.prefecture,
        city: data.city,
        area: data.town,
        prefectureJP: data.perfecture_jp,
        cityJP: data.jp_add_1,
        areaJP: data.jp_add_2
      };
    }).then(function(regionData) {
      self.reg.regionData = regionData;
      return UserService.registerNewUser(self.reg);
    }).then(function(response) {
      //registration complete! go to login page
      $state.transitionTo('login', {flashMessage:{style:'success', msg:'Registration was a success! Please sign-in using the form below'}}, {reload: true});
    }, function(response) {
      //username includes special characters
      //username already exists
      //passwords do not match

      //process errors and inform the user
      var errs = response.data;
      for (var e in errs) {
        if( errs.hasOwnProperty(e) ) {
          self.reg.err[e] = errs[e];
        }
      }
    });
  }; //end submitRegistration

}]);

app.controller('ViewSinglePostController', function(
    $state, $rootScope,                                         //angularjs specific
    PostService, CommentService, ModalService, RatingService,   //application services
    post, comments, isFollowing, ratingData, doesLike           //resolved dependencies
  ) {
  var self = this;
  self.post = post;
  self.post.comments = comments;
  self.post.rating = ratingData;
  self.isFollowing = isFollowing;
  self.doesLike = doesLike;
  self.isEditable = ($rootScope.user == self.post.owner.username);

  self.postComment = function() {
    //html encode newlines
    //https://stackoverflow.com/questions/863779/javascript-how-to-add-line-breaks-to-an-html-textarea
    self.newComment.details = self.newComment.details.replace(/\r?\n/g, '<br/>');

    CommentService.post(self.newComment, self.post.id).then(function(response) {
      return;
    }).then(function(response) {
      return PostService.getComments(self.post.id);
    }).then(function(response) {
      self.post.comments = response.data;
      self.newComment = {};
      self.commentForm.$setPristine();
    });
  };

  self.deletePost = function(pid) {
    var fnDelConf = function() {
      PostService.delete(pid).then(function(response){
        $state.transitionTo('index', { flashMessage:{style:'warning', msg:'Post [' + self.post.title + '] has been deleted'}}, {reload: true});
      });
    };

    ModalService.show({},{
      closeButtonText: 'CANCEL',
      actionButtonText: 'DELETE',
      headerText: 'Delete Post?',
      bodyText: 'Are you sure you want to delete your post?'
    }).then(fnDelConf, function(result) { /*cancelled! do nothing*/ });
  };

  self.deleteComment = function(pid, cid) {
    var fnDelConf = function() {
      CommentService.delete(pid, cid).then(function(response) {
        return PostService.getComments(self.post.id);
      }).then(function(response) {
        self.post.comments = response.data;
      });
    };

    ModalService.show({},{
      closeButtonText: 'CANCEL',
      actionButtonText: 'DELETE',
      headerText: 'Delete Comment',
      bodyText: 'Are you sure you want to delete your comment?'
    }).then(fnDelConf, function(result) { /*cancelled! do nothing*/ });
  };

  //apparently ng-repeat cant do ranges
  //https://stackoverflow.com/questions/11873570/angularjs-for-loop-with-numbers-ranges
  self.getStarRange = function() {
    var arr = Array(Math.floor(self.post.rating.average));
    for(i=0; i<arr.length; i++) {
      arr[i] = i;
    }
    return arr;
  };

  self.doRating = function() {
    //functions for after
    fnRatePost = function(rating) {
      return RatingService.rate(self.post.id, rating);
    };

    fnUpdateRating = function() {
      return RatingService.getAverage(self.post.id).then(function(response) {
        self.post.rating = response.data;
      });
    };

    //modal settings
    modalDefaults = {
      controller: function($scope, $uibModalInstance) {
        $scope.modalOptions = {
          text: {
            cancel: "Cancel"
          },
        };
        $scope.modalOptions.rate = function (result) {
          $uibModalInstance.close(result);
        };
        $scope.modalOptions.close = function (result) {
          $uibModalInstance.dismiss('cancel');
        };
      },
      templateUrl: '/components/modal-template-rating.html'
    };

    //display modal
    ModalService.show(modalDefaults,{
      closeButtonText: 'CANCEL',
      actionButtonText: 'DELETE',
      headerText: 'Delete Comment',
      bodyText: 'Are you sure you want to delete your comment?'
    })
    .then(fnRatePost, function(result) { /*cancelled! do nothing*/ })
    .then(fnUpdateRating, function(result) { /* error updating */ });
  };

  self.doFollowing = function() {
    var err = function(response) { console.log(response); };
    PostService.setFollowing(self.post.id, !(self.isFollowing)).then(function() {
      self.isFollowing = !self.isFollowing;
    },err);
  };

  self.doLike = function() {
    var err = function(response) { console.log(response); };
    PostService.like(self.post.id, !(self.doesLike)).then(function() {
      self.doesLike = !self.doesLike;
    },err);
  };

  self.showImage = function() {
    var fnEmpty = function() { /*do nothing*/ };

    var template = '<div class="modal-body"> <img src="' + self.post.assetUrl + '" class="single-img" /> </div>';
    ModalService.show({
      template: template,
      backdrop: true
    },{}).then(fnEmpty, fnEmpty);
  };

});


app.controller('ViewUserController', function(marked, PostService, user, posts) {
  self = this;
  self.user = user;
  self.posts = posts;

  self.posts.forEach(function(post) { post.description = PostService.filterDesc(post.description); });

  self.locationImg = function() {
    var city = self.user.region.city.split(' ').join('+') + ',';
    var pref = self.user.region.prefecture.split(' ').join('+') + ',';
    var url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + city + pref + 'Japan&zoom=13&size=600x300&maptype=roadmap';
    return url;
  };

});

app.controller('UpdateUserController', function(Flash, UserService, PostService, ModalService, user, posts) {
  self = this;
  self.user = user;
  self.posts = posts;

  self.posts.forEach(function(post) { post.description = PostService.filterDesc(post.description); });

  self.locationImg = function() {
    var city = self.user.region.city.split(' ').join('+') + ',';
    var pref = self.user.region.prefecture.split(' ').join('+') + ',';
    var url = 'https://maps.googleapis.com/maps/api/staticmap?center=' + city + pref + 'Japan&zoom=13&size=600x300&maptype=roadmap';
    return url;
  };

  self.updatePassword = function() {
    fnHandleSuccess = function(response) {
      //console.log(response);
      var msgSuccess = '<strong>Success!</strong> Your password has been changed';
      var id = Flash.create('success', msgSuccess, 2000, {container:'flash-fixed', class:'custom-flash'}, true);
      self.passForm.$dirty = false;
      self.passForm.newpassword.$dirty = false;
      self.passForm.newpassconf.$dirty = false;
      self.new.password = '';
      self.new.passconf = '';
    };

    fnHandleFail = function(response) {
      console.log(response);
      var msgFail = '<strong>Uh oh!</strong> Something went while trying to update your password';
      var id = Flash.create('danger', msgFail, 2000, {container:'flash-fixed', class:'custom-flash'}, true);
    };

    UserService.updatePassword(self.new.password, self.new.passconf).then(fnHandleSuccess, fnHandleFail);
  };

  //truncates the description to the first 20 words
  self.filterDesc = function(markdown) {
    //remove html tags
    //https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/
    var html = marked(markdown);
    var text = html.replace(/(<([^>]+)>)/ig,"");
    var desc = text.split(' ').slice(0,20).join(' ').slice(0,-1);
    return desc;
  };

  self.deletePost = function(pid) {
    var fnDelConf = function() {
      PostService.delete(pid).then(function(response){
        for(i=0; i<self.posts.length; i++) {
          if(self.posts[i].id == pid) {
            self.posts.splice(self.posts.indexOf(i), 1);
          }
        }
      });
    };

    ModalService.show({},{
      closeButtonText: 'CANCEL',
      actionButtonText: 'DELETE',
      headerText: 'Delete Post?',
      bodyText: 'Are you sure you want to delete your post?'
    }).then(fnDelConf, function(result) { /*cancelled! do nothing*/ });
  };
});

app.service('CommentService', function($http, $q) {
  var service = {
    post: function(comment, pid) {
      return $http.post('/api/posts/' + pid + '/comments', comment, {headers:{'Content-Type':'application/json'}});
    },
    delete: function(pid, cid) {
      return $http.delete('/api/posts/' + pid + '/comments/' + cid, {headers:{'Content-Type':'application/json'}});
    }
  };

  return service;
});

app.service('PostService', function($http, $location, $state, $q, marked) {
  var service = {
    getPost: function(id) {
      return $http.get('/api/posts/' + id);
    },

    getAllByType: function(type) {
      return $http.get('/api/posts/type/' + type).then(function(response) { return response.data; });
    },

    getAll: function() {
      return $http.get('/api/posts').then(function(response) { return response.data; });
    },

    getComments: function(id) {
      return $http.get('/api/posts/' + id + '/comments');
    },

    getFollowCount: function() {
      return $http.get('/api/posts/follow/count');
    },

    create: function(data) {
      return $http.post('/api/posts', data, {headers:{'Content-Type':'application/json'}});
    },

    uploadImg: function(pid, img) {
      return $http.post('/api/posts/upload/' + pid, img, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      });
    },

    update: function(data, img) {
      return $http.put('/api/posts/' + data.id, data, {headers:{'Content-Type':'application/json'}});
    },

    delete: function(pid) {
      return $http.delete('/api/posts/' + pid, {headers:{'Content-Type':'application/json'}});
    },

    setFollowing: function(pid, bool) {
      var method = (bool) ? 'POST' : 'DELETE';
      return $http({
        method: method,
        url: '/api/user/follow/' + pid
      });
    },

    isFollowing: function(pid) {
      return $http.get('/api/user/follow/' + pid);
    },

    doesLikePost: function(pid, username) {
      return $http.get('/api/posts/' + pid + '/like/' + username);
    },

    like: function(pid, bool) {
      var method = (bool) ? 'POST' : 'DELETE';
      return $http({
        method: method,
        url: '/api/posts/' + pid + '/like'
      });
    },

    //truncates the description to the first 20 words
    filterDesc:function(markdown) {
      //remove html tags
      //https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/
      var html = marked(markdown);
      var text = html.replace(/(<([^>]+)>)/ig,"");
      var desc = text.split(' ').slice(0,20);

      //no spaces in Japanese so limit to the first 20 chars
      //also limits posts w/ less than 20 words to now show all in the index
      if(desc.length < 20) {
        desc = text.split('').slice(0,20).join('').slice(0,-1);
      } else {
        desc = desc.join(' ').slice(0,-1);
      }
      return desc;
    },
  };

  return service;
});

app.service('TagService', function($http) {
  var service = {
    getAll: function() {
      return $http.get('/api/tags', {headers:{'Content-Type':'application/json'}});
    },

    processTags: function(tags) {
      tagStrArr = [];
      tags.forEach(function(t) { tagStrArr.push(t.name); });
      return $http.post('/api/tags/process', tagStrArr, { headers:{'Content-Type':'application/json'}});
    },

    getPosts: function(tagName) {
      return $http.get('/api/tags/' + tagName + '/posts');
    }
  };

  return service;
});

app.service('UserService', function($http, $rootScope, $q) {
  $rootScope.authInit = false;

  var service = {
    init: function() {
      return $http.get('/api/user/me').then(function(response){
        //user is logged in, store auth
        $rootScope.authenticated = true;
        $rootScope.user = response.data.username;
      }, function(data) {
        //user is not logged in, clear auth
        $rootScope.authenticated = false;
        $rootScope.user = null;
      }).finally(function() {
        $rootScope.authInit = true;
      });
    },

    isAuthenticated: function() {
      if($rootScope.authInit) {
        return ($rootScope.authenticated) ? $q.when() : $q.reject('user not authorized');
      } else {
        return $http.get('/api/user/me');
      }
    },

    setAuth: function(auth, user) {
      $rootScope.authenticated = auth;
      $rootScope.user = user;
    },

    getUsername: function() {
      return $rootScope.user;
    },

    getFollowedPosts: function() {
      return $http.get('/api/user/follow');
    },

    getUser: function(username) {
      return $http.get('/api/user/' + username);
    },

    getMe: function() {
      return $http.get('/api/user/me');
    },

    getLikedPostIDs: function() {
      if($rootScope.authenticated) {
        return $http.get('/api/user/me/like');
      } else {
        return $q.when([]);
      }
    },

    getPosts: function(username) {
      return $http.get('/api/user/' + username + '/posts');
    },

    updatePassword: function(password, passconf) {
      return $http.post('/api/user/update', {password:password, passconf:passconf}, {headers:{'Content-Type':'application/json'}});
    },

    registerNewUser: function(data) {
      return $http({
        method: 'POST',
        url: '/api/user/register',
        data: {username:data.username, password:data.password, passconf:data.passconf, region:data.regionData},
        headers: {'Content-Type':'application/json'}
      });
    },

    login: function(username, password) {
      return $http({
        method: 'POST',
        url:'/api/login',
        data: {u:username, p:password},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
          return str.join('&');
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        responseType: 'text'
      });
    },

    logout: function() {
      return $http.get('/api/logout');
    }
  };

  return service;
});

app.service('RatingService', ['$http', '$q', function($http, $q) {
  var service = {
    rate: function(pid, rating) {
      return $http.post('/api/rating/' + pid, rating, {headers:{'Content-Type':'application/json'}});
    },

    getAverage: function(pid) {
      return $http.get('/api/rating/' + pid);
    },

    getAll: function() {
      return $http.get('/api/rating');
    }
  };

  return service;
}]);

app.service('PostalService', ['$http', '$q', function($http, $q) {
  var fnReturnTrue = function() { return true; };
  var fnReturnFalse = function() { return false; };
  var fnReject = function(response) { return $q.reject(response); };

  var service = {
    doesRegionExist: function(postPart) {
      return $http.get('/assets/data/postal/' + postPart + '.json').then(fnReturnTrue, fnReturnFalse);
    },

    getRegionData: function(yuu, bin) {
      return $http.get('/assets/data/postal/' + yuu + '.json').then(function(response) {
        var postData = response.data;
        var postcode = yuu +  bin;
        if(postData.hasOwnProperty(postcode)) {
          return postData[postcode];
        } else {
          return fnReject('no data for: ' + postcode);
        }
      }, fnReject);
    }
  };

  return service;
}]);

app.service('ModalService',['$uibModal', function($modal){
  var modalDefaults = {
    backdrop: 'static',
  	keyboard: true,
  	modalFade: true,
  	templateUrl: '/components/modal-template.html'
  };

  var modalOptions = {
    closeButtonText: 'Close',
    actionButtonText: 'OK',
    headerText: 'Proceed?',
    bodyText: 'Perform this action?'
  };

  this.show = function (customModalDefaults, customModalOptions) {
    if (!customModalDefaults) customModalDefaults = {};
    //customModalDefaults.backdrop = 'static';
    //Create temp objects to work with since we're in a singleton service
    var tempModalDefaults = {};
    var tempModalOptions = {};

    //Map angular-ui modal custom defaults to modal defaults defined in service
    angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

    //Map modal.html $scope custom properties to defaults defined in service
    angular.extend(tempModalOptions, modalOptions, customModalOptions);

    if (!tempModalDefaults.controller) {
      tempModalDefaults.controller = function ($scope, $uibModalInstance) {
        $scope.modalOptions = tempModalOptions;
        $scope.modalOptions.ok = function (result) {
          $uibModalInstance.close(result);
        };
        $scope.modalOptions.close = function (result) {
          $uibModalInstance.dismiss('cancel');
        };
      };
    }

    return $modal.open(tempModalDefaults).result;
  };
}]);
