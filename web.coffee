express = require("express")
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
    rdio.getTrackId(originalLink, (err, trackId) ->
        if err
            res.status(500)
            return
        api_key = process.env.SONGLINK_ECHO_NEST_API_KEY
        request.get("http://developer.echonest.com/api/v4/song/profile?api_key=#{api_key}&format=json&track_id=#{trackId}", (err, song) ->
            if err
                res.status(500)
                return
            res.end(JSON.parse(song.body).response.songs[0].id)
        )
    )
)

port = process.env.PORT || 5000
app.listen port, ->
    console.log 'listening on', port
