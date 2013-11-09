HomeView = require("../views/home")
Song = require("../models/song")
SongView = require("../views/song")

activateView = (ViewCls) ->
    homeView = new ViewCls().render()
    $("section.app").empty().append(homeView.el)


class MainRouter extends Backbone.Router
    routes:
        'song/:sid': "song"
        '': "home"

    home: ->
        activateView(HomeView)

    song: (sid) ->
        song = new Song(id: sid)
        songView = new SongView(model: song).render()
        $("section.app").empty().append(songView.el)
        
    createCounter: ->
        $("section.app").empty().append('<p>create</p>')

main = new MainRouter()
module.exports = main
