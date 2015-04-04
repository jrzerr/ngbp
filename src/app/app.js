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
  });

  $scope.$on('version:expired', function (event, running, current) {
    console.log("Versions do not match!");
    console.log("Running: "+running);
    console.log("Current: "+current);
  });

  })
;

