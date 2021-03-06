express = require("express")
_ = require "underscore"
Q = require 'q'
request = require("request")
url = require('url')
fs = require("fs")
rdio = require("./soundlinkRdio")

log = (args...) -> console.log(args...)

app = express()
app.use(express.logger())
app.use(express.cookieParser())
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.compress())
app.use(express.session({ secret: '75be3501-4d7b-481c-8efb-551660b39aa2' }))

app.use('/', express.static(__dirname + '/static/public/'))
app.use('/static', express.static(__dirname + '/static/public'))
app.use (req, res, next) ->
    if req.path.indexOf("/api") is 0
        return next()
    console.log "assuming index", req.path
    file = fs.createReadStream(__dirname + '/static/public/index.html')
    file.pipe(res)

app.get('/api/findSong', (req, res) ->
    originalLink = url.parse(req.url, true).query.originalLink
    if originalLink.indexOf("http://open.spotify") == 0
        trackId = originalLink.match("http://open.spotify.com/track/([[a-zA-Z0-9]*)")[1]
        console.log "using track id", trackId
        api_key = process.env.SONGLINK_ECHO_NEST_API_KEY
        request.get("http://developer.echonest.com/api/v4/song/profile?api_key=#{api_key}&format=json&track_id=spotify-WW:track:#{trackId}", (err, song) ->
            if err
                res.status(500)
                return
            
            songId = JSON.parse(song.body).response.songs[0].id
            res.end(songId)
        )
        return
    if originalLink.indexOf("http://rd.io/x") == 0
        sidFromRdio(originalLink, (err, sid) ->
            if err
                res.end(500)
                return
            res.end(sid)
        )
        return
    res.status(404)
    res.end()
)

sidFromRdio = (rdioLink, callback) ->
    rdio.getTrackId(rdioLink, (err, trackId) ->
        if err
            callback(500, null)
            return
        api_key = process.env.SONGLINK_ECHO_NEST_API_KEY
        request.get("http://developer.echonest.com/api/v4/song/profile?api_key=#{api_key}&format=json&track_id=#{trackId}", (err, song) ->
            if err
                callback(500, null)
                return
            callback(null, JSON.parse(song.body).response.songs[0].id)
        )
    )

app.get('/api/shorten', (req, res) ->
    originalLink = url.parse(req.url, true).query.u
    if originalLink.indexOf("http://rd.io/x") == 0
        sidFromRdio(originalLink, (err, sid) ->
            proxiedLink = "http://www.songlink.biz/song/#{sid}"
            request.post("https://www.googleapis.com/urlshortener/v1/url", json: longUrl: proxiedLink, (err, shortened) ->
                if err
                    res.status(500)
                    return
                console.log "short", shortened.body.id
                
                res.end(shortened.body.id)
            )
        )
        return

    request.post("https://www.googleapis.com/urlshortener/v1/url", json: longUrl: originalLink, (err, shortened) ->
        if err
            res.status(500)
            return
        console.log "short", shortened.body.id
        
        res.end(shortened.body.id)
    )
)

app.get('/api/songInfo/:id', (req, res) ->
    sid = req.params.id
    if sid == "undefined"
        res.status(404)
        return
    api_key = process.env.SONGLINK_ECHO_NEST_API_KEY
    console.log("http://developer.echonest.com/api/v4/song/profile?api_key=#{api_key}&format=json&id=#{sid}")
    request.get("http://developer.echonest.com/api/v4/song/profile?api_key=#{api_key}&format=json&id=#{sid}&bucket=tracks&bucket=id:rdio-US&bucket=id:spotify-WW", (err, song) ->
        if err
            res.status(500)
            return
        
        song = JSON.parse(song.body).response.songs[0]
        outSong =
            title: song.title
            id: song.id
            artist_name: song.artist_name

        for tr in song.tracks
            if tr.catalog == "rdio-US"
                outSong.rdio_id = tr.foreign_id.split(':')[2]
            if tr.catalog == "spotify-WW"
                outSong.spotify_id = tr.foreign_id.split(':')[2]

        rdio_def = Q.defer()
        if outSong.rdio_id
            rdio.getTrack(outSong.rdio_id, (err, track) ->
                if err
                    res.status(500)
                    return
                rdio_def.resolve(_(track).values()[0])
                #outSong.rdio_track = _(track).values()[0]
                #res.end(JSON.stringify(outSong))
            )
        else
            rdio_def.resolve()

        spot_def = Q.defer()
        if outSong.spotify_id
            request.get("http://ws.spotify.com/lookup/1/.json?uri=spotify:track:#{outSong.spotify_id}", (err, track) ->
                if err
                    console.log "spotify err"
                    return
                spot_def.resolve(JSON.parse(track.body).track)
            )
        else
            spot_def.resolve()

        Q.all([rdio_def.promise, spot_def.promise]).spread( (rdioTrack, spotifyTrack) ->
            outSong.rdio_track = rdioTrack
            outSong.spotify_track = spotifyTrack
            
            res.end(JSON.stringify(outSong))
        )


    )
)

port = process.env.PORT || 5000
app.listen port, ->
    console.log 'listening on', port
