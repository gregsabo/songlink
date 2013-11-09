HomeModel = require '../models/home'

module.exports = class HomeView extends Backbone.View
    model: new HomeModel()
    template: require 'views/templates/home'
    render: ->
        @$el.html(@template())
        this

    events:
        "click .btn-primary": "requestLink"

    requestLink: ->
        originalLink = @$el.find("input").val()
        console.log "requesting", originalLink
        $.get("/api/findSong", originalLink: originalLink).done( (res) ->
            console.log "res was", res
            
        )
        

