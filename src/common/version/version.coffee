angular.module('version', [])

.factory 'versionService', ($http, $q) ->
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

  Version.isCurrent = () ->
    deferred = $q.defer()
    # For testing purposes.
    # currentVersion is always reset to "" after
    # isCurrent is called. If currentVersion is
    # not "" at the beginning of the call, an $http
    # request should not be made.
    if currentVersion isnt ""
      if currentVersion is runningVersion
        deferred.resolve "Versions match"
      else
        deferred.reject "Versions do not match!"
    else
      runningVersionPromise.then (data) ->
        Version.loadCurrent()
        .then (data) ->
          currentVersion = data.data.version
          if currentVersion is runningVersion
            deferred.resolve "Versions match"
          else
            deferred.reject "Versions do not match!"
          currentVersion = ""
    
    return deferred.promise

  Version.setEndpoint = (location) ->
    endpoint = location

  Version.getEndpoint = () ->
    return endpoint;

          
  
  return Version