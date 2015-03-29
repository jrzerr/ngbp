describe( 'AppCtrl', function() {
  describe( 'versionService', function() {
    var AppCtrl, $location, $scope, $httpBackend, versionService, versionRequestHandler;
    var done, current;

    beforeEach( module( 'ngBoilerplate' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope, versionService, $injector ) {
      $httpBackend = $injector.get('$httpBackend');
      $location = _$location_;
      versionRequestHandler = $httpBackend.when('GET', 'version.json')
      .respond(200, '{ "version": "1.0.0" }');
      versionRequestHandler = $httpBackend.when('GET', 'test_versionx.json')
      .respond(200, '{ "version": "1.0.1" }');
      versionRequestHandler = $httpBackend.when('GET', 'test_versiony.json')
      .respond(200, '{ "version": "1.0.2" }');

      $scope = $rootScope.$new();
      Version = versionService;
      AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope, versionService: versionService });
    }));

    it( 'should not update when versions are manually equal', inject( function() {

      runs(function () {
        done = false;
        current = true;
        Version.setRunning("1.0.0");
        Version.setCurrent("1.0.0");
        expect( Version.getRunning() ).toBe( Version.getCurrent() );
        Version.isCurrent()
        .then(function () {
          done = true;
          current = true;
        }, function () {
          done = true;
          current = false;
        });
        $scope.$apply();
      });

      waitsFor(function () {
        console.log("WAITING");
        return done;
      });

      runs(function () {
        expect(current).toBeTruthy();
      });

      $httpBackend.flush();


    }));

    it( 'should update when versions are manually not equal', inject( function() {

      runs(function () {
        done = false;
        current = true;
        Version.setRunning("1.0.0");
        Version.setCurrent("1.0.1");
        expect( Version.getRunning() ).not.toBe( Version.getCurrent() );
        Version.isCurrent()
        .then(function () {
          done = true;
          current = true;
        }, function () {
          done = true;
          current = false;
        });
        $scope.$apply();
      });

      waitsFor(function () {
        return done;
      });

      runs(function () {
        expect(current).toBeFalsy();
      });

      $httpBackend.flush();


    }));

    it( 'should detect updates when loaded from server', inject( function() {

    }));
  });
});
