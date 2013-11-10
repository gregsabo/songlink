module.exports = class SongView extends Backbone.View
    template: require 'views/templates/song'
    initialize: ->
        @listenTo @model, "sync", @render, @
        @model.fetch()

    events:
        "click .rdio-open": "rememberRdio"
        "click .spotify-open": "rememberSpotify"
        "click .forget-preference": "forgetPreference"

    render: ->
        pref = localStorage?.SONGLINK_SERVICE_PREFERENCE
            
        ctx = _(@model.attributes).clone()
        if ctx.rdio_track?
            if window.iOS
                ctx.rdio_link = ctx.rdio_track
                    .shortUrl.replace("http:\/\/", "rdio:\/\/")
            else
                ctx.rdio_link = "http://rdio.com#{ctx.rdio_track.url}"

        ctx.redirecting = false
        if @model.get("rdio_track") and pref == "rdio"
            ctx.redirecting = true
            ctx.redirect_preference = "Rdio"
        if @model.get("spotify_track") and pref == "spotify"
            ctx.redirecting = true
            ctx.redirect_preference = "Spotify"
        if ctx.rdio_track
            ctx.album_img = ctx.rdio_track.icon400 or ctx.rdio_track.icon

        @$el.html(@template(ctx))
        if ctx.redirecting
            setTimeout( =>
                @$(".redirect-notify").slideDown()
            , 1000)
            setTimeout( =>
                @doRedirect(ctx)
            , 4000)
        this

    doRedirect: (ctx) ->
        return unless localStorage.SONGLINK_SERVICE_PREFERENCE?
        pref = localStorage.SONGLINK_SERVICE_PREFERENCE
        if pref == "rdio"
            window.location.href = ctx.rdio_link
            return
        if pref == "spotify"
            window.location.href = ctx.spotify_track.href
            return
            
    rememberRdio: ->
        localStorage.SONGLINK_SERVICE_PREFERENCE = "rdio"
        true

    rememberSpotify: ->
        localStorage.SONGLINK_SERVICE_PREFERENCE = "spotify"
        true

    forgetPreference: (e) ->
        delete localStorage.SONGLINK_SERVICE_PREFERENCE
        @$(".redirect-notify").slideUp()
        #@render()
        e.preventDefault()

