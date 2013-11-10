_ = require("underscore")
Rdio = require('./contrib/rdio')
rdio = new Rdio([process.env.RDIO_KEY, process.env.RDIO_SHARED_SECRET])

module.exports =
    getTrackId: (url, callback) ->
        shortCode = url.match("http://rd.io/x/(.*)/")[1]
        console.log "shortcode", shortCode
        
        rdio.call('getObjectFromShortCode', {'short_code': shortCode}, (err, res) ->
            if err
                console.log "rdio err", err
                callback(err, null)
                return
            callback(null, "rdio-US:track:#{res.result.key}")
        )

    getTrack: (tid, callback) ->
        rdio.call('get', {'keys': tid}, (err, res) ->
            if err
                console.log "rdio err", err
                callback(err, null)
                return
            callback(null, res.result)
        )
