angular.module('version', [])

.factory 'versionService', ($http, $location, $q, $timeout) ->
  version = {}
  runningVersion = ""
  currentVersion = ""
  runningVersionPromise = {}
  endpoint = 'version.json'

  version.setRunning  = (v) ->
    runningVersion = v

  version.getRunning = () ->
    return runningVersion


  version.setCurrent = (v) ->
    currentVersion = v

  version.getCurrent = () ->
    return currentVersion

  version.loadRunning = () ->
    version.loadCurrent()
    .success (data) ->
      runningVersion = data.version

  version.loadCurrent = () ->
    return $http.get(endpoint, { cache: false })
    .error (data) ->
      # Not sure what is the best way to handle
      # a failed requrest. Should probably try
      # a few more attempts
      console.log "Could not fetch version"

  version.isCurrent = () ->
    deferred = $q.defer()
    # For testing purposes.
    # currentVersion is always reset to "" after
    # isCurrent is called. If currentVersion is
    # not "" at the beginning of the call, an $http
    # request should not be made.
    if currentVersion isnt ""
      if currentVersion is runningVersion
        deferred.resolve("Versions match")
      else
        deferred.reject("Versions do not match!")
    else
      console.log deferred
      version.loadCurrent()
      .success (data) ->
        currentVersion = data.version
        if currentVersion is runningVersion
          deferred.resolve("Versions match")
        else
          deferred.reject("Versions do not match!")
    
    currentVersion = ""
    return deferred.promise

  version.setEndpoint = (location) ->
    endpoint = location

  version.getEndpoint = () ->
    return endpoint;

          
  
  return version