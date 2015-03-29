describe( 'AppCtrl', function() {
  describe( 'versionService', function() {
    var AppCtrl, $location, $scope, versionService, versionRequestHandler;

    beforeEach( module( 'ngBoilerplate' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope, versionService, $httpBackend ) {
      $location = _$location_;
      versionRequestHandler = $httpBackend.when('GET', 'version.json')
      .respond(200, "{ 'version': 1.0.0 }");
      versionRequestHandler = $httpBackend.when('GET', 'test_versionx.json')
      .respond(200, "{ 'version': 1.0.1 }");
      versionRequestHandler = $httpBackend.when('GET', 'test_versiony.json')
      .respond(200, "{ 'version': 1.0.2 }");

      $scope = $rootScope.$new();
      Version = versionService;
      AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope, versionService: versionService });
    }));

    it( 'should detect updates when version is manually set', inject( function() {
      var done = false;
      Version.setRunning("1.0.0");
      Version.setCurrent("1.0.0");
      expect( Version.getCurrent() ).toBe( Version.getRunning() );
      runs( function () {
        Version.isCurrent()
        .then(function (data) {
          done = true;
        });
        $scope.$apply();
      });
      waitsFor( function () {
        return done;
      });
      runs( function () {
        expect( done ).toBeTruthy();
      });

      expect( AppCtrl ).toBeTruthy();
    }));

    it( 'should detect updates when loaded from server', inject( function() {
      var done = false;
      Version.setEndpoint('test_versionx.json');
      
      runs( function () {
        console.log("HELLO");
        Version.loadRunning();
        Version.setEndpoint('test_versiony.json');
        Version.isCurrent()
        .then(null, function (data) {
          done = true;
        });
        $scope.$apply();
      });
      waitsFor( function() {
        return done;
      });
      runs( function () {
        expect( done ).toBeTruthy();
      });
      expect( AppCtrl ).toBeTruthy();
    }));
  });
});
