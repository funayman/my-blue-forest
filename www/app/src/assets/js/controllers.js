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
