angular
    .module("touristApp", [
        "ui.router",
        "ngResource"
    ])

    .config([
        "$stateProvider",
        "$urlRouterProvider",
        RouterFunction
    ])

    .factory("LocationFactory", ["$http",
        LocationFactoryFunction
    ])

    .factory("ActivityFactory", ["$resource",
        ActivityFactoryFunction
    ])

    .controller("ActivityIndexController", [
        "ActivityFactory",
        "$stateParams",
        ActivityIndexControllerFunction
    ])

    .controller("LocationIndexController", [
        "LocationFactory",
        "$timeout",
        LocationIndexControllerFunction
    ])

    .controller("ActivityShowController", [
      "ActivityFactory",
      "$stateParams",
      ActivityShowControllerFunction
    ])


function LocationFactoryFunction($http) {
    return $http({
        method: 'GET',
        url: 'http://localhost:3000/locations.json'
    });
}

function ActivityFactoryFunction($resource) {
    return $resource("http://localhost:3000/locations/:location_id/activities/:id");
}

function LocationIndexControllerFunction(LocationFactory, $timeout) {
    var vm = this;

    var options = {
        types: ['(cities)']
    }

    $timeout(function() {
        var input = document.getElementById('search-box');
        var autocomplete = new google.maps.places.Autocomplete(input, options);
    })

    LocationFactory.then(function successCallback(response) {
        vm.location = response;
    }, function errorCallback(response) {});
    this.locationQuery = null;
    this.alertLocation = function() {
        console.log(this.locationQuery);
    }
}

function ActivityShowControllerFunction(ActivityFactory, $stateParams) {
 var vm = this;
 vm.activityDetails = activities
  .filter(function(activity){
    return activity.id == $stateParams.activity_id}
  )[0];
}

function ActivityIndexControllerFunction(ActivityFactory, $stateParams) {
    // this.activity = ActivityFactory.get({
    //     id: $stateParams.id
    // });
    this.activities = activities;
}


function RouterFunction($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("location", {
            url: "/home",
            templateUrl: "js/ng-views/location/index.html",
            controller: "LocationIndexController",
            controllerAs: "vm"
        })
        .state("activity", {
            url: "/locations/:location_id/activities",
            templateUrl: "js/ng-views/activity/index.html",
            controller: "ActivityIndexController",
            controllerAs: "vm"
        })
        .state("activity.details", {
            url: "/:activity_id",
            templateUrl: "js/ng-views/activity/show.html",
            controller: "ActivityShowController",
            controllerAs: "vm"
        })


    $urlRouterProvider.otherwise('/home');
}
