module.exports = class SongView extends Backbone.View
    template: require 'views/templates/song'
    initialize: ->
        @listenTo @model, "sync", @render, @
        @model.fetch()

    render: ->
        console.log "rendering", @model.attributes
        
        ctx = _(@model.attributes).clone()
        if ctx.rdio_track?
            if window.iOS
                ctx.rdio_link = ctx.rdio_track
                    .shortUrl.replace("http:\/\/", "rdio:\/\/")
            else
                ctx.rdio_link = "http://rdio.com#{ctx.rdio_track.url}"
        @$el.html(@template(ctx))
        this
