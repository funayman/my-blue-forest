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
