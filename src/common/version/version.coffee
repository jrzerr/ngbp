angular.module('version', [])

.factory 'versionService', ($rootScope, $http, $q) ->
  Version = {}
  runningVersion = ""
  currentVersion = ""
  runningVersionPromise = {}
  endpoint = 'version.json'

  Version.setRunning  = (v) ->
    runningVersion = v

  Version.getRunning = () ->
    return runningVersion

  Version.setCurrent = (v) ->
    currentVersion = v

  Version.getCurrent = () ->
    return currentVersion

  # load current version from server and assign
  # the value to runningVersion
  # this should only be run once
  Version.loadRunning = () ->
    runningVersionPromise = Version.loadCurrent()
    .success (data) ->
      runningVersion = data.version

  Version.loadCurrent = () ->
    return $http.get(endpoint, { cache: false })
    .error (data) ->
      # Not sure what is the best way to handle
      # a failed requrest. Should probably try
      # a few more attempts
      console.log "Could not fetch version"

  Version.processPromise = (deferred, running, current) ->
    if current is running
      deferred.resolve "Versions match"
    else
      deferred.reject "Versions do not match!"
      $rootScope.$broadcast("version:expired",
        running, current)

  Version.isCurrent = () ->
    deferred = $q.defer()
    # For testing purposes.
    # currentVersion is always reset to "" after
    # isCurrent is called. If currentVersion is
    # not "" at the beginning of the call, an $http
    # request should not be made.
    if currentVersion isnt ""
      Version.processPromise(deferred, runningVersion, currentVersion)
    else
      runningVersionPromise.then (data) ->
        Version.loadCurrent()
        .then (data) ->
          Version.processPromise(deferred, runningVersion, data.data.version)

          currentVersion = ""
    
    return deferred.promise

  Version.setEndpoint = (location) ->
    endpoint = location

  Version.getEndpoint = () ->
    return endpoint;

          
  
  return Version