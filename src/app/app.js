angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ui.router',
  'config',
  'version'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run (versionService) {
  versionService.loadRunning();
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, versionService ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
    versionService.isCurrent()
      .then(function (data) {
        console.log("success: "+data);
      }, function (data) {
        console.log("failed: "+data);
      }, function (data) {
        console.log("notify: "+data);
      });
  });
})

;

