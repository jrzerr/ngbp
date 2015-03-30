
describe( 'versionService', function() {
  var AppCtrl, $location, $scope, $httpBackend, versionService, versionRequestHandler;
  var current, broadcast;

  beforeEach( module( 'ngBoilerplate' ) );

  beforeEach( inject( function( $controller, _$location_, $rootScope, versionService, $injector ) {
    $httpBackend = $injector.get('$httpBackend');
    $location = _$location_;
    $httpBackend.when('GET', 'version.json')
    .respond(200, '{ "version": "1.0.0" }');
    $httpBackend.when('GET', 'test_versionx.json')
    .respond(200, '{ "version": "1.0.1" }');
    $httpBackend.when('GET', 'test_versiony.json')
    .respond(200, '{ "version": "1.0.2" }');

    $scope = $rootScope.$new();
    Version = versionService;
    AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope, versionService: versionService });
  }));

  it( 'should not update when versions are manually equal', inject( function() {
    current = true;
    Version.setRunning("1.0.0");
    Version.setCurrent("1.0.0");
    expect( Version.getRunning() ).toBe( Version.getCurrent() );
    Version.isCurrent()
    .then(function () {
      current = true;
    }, function () {
      current = false;
    });
    $scope.$apply();

    expect(current).toBeTruthy();



  }));

  it( 'should update when versions are manually not equal', inject( function() {

    done = false;
    current = true;
    Version.setRunning("1.0.0");
    Version.setCurrent("1.0.1");
    expect( Version.getRunning() ).not.toBe( Version.getCurrent() );
    Version.isCurrent()
    .then(function () {
      current = true;
    }, function () {
      current = false;
    });
    $scope.$apply();

    expect(current).toBeFalsy();



  }));

  it( 'should not update when versions from server are equal', inject( function() {
    current = false;
    broadcast = false;
    $scope.$on("version:expired", function (event, old_version, new_version) {
      broadcast = true;
    });
    Version.setEndpoint("test_versionx.json");
    Version.loadRunning();
    Version.isCurrent().then(function () {
      current = true;
    });
    $httpBackend.flush();
    $scope.$apply();

    expect( current ).toBeTruthy();
    expect( broadcast ).toBeFalsy();


  }));

  it( 'should update when versions from server are not equal', inject( function() {
    current = false;
    broadcast = false;
    $scope.$on("version:expired", function (event, old_version, new_version) {
      broadcast = true;
    });
    Version.setEndpoint("test_versionx.json");
    Version.loadRunning();
    Version.setEndpoint("test_versiony.json");
    Version.isCurrent().then(function () {
      current = true;
    });
    $httpBackend.flush();


    $scope.$apply();
    expect( current ).toBeFalsy();
    expect( broadcast ).toBeTruthy();

  }));
});