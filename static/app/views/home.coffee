HomeModel = require '../models/home'

module.exports = class HomeView extends Backbone.View
    model: new HomeModel()
    template: require 'views/templates/home'
    render: ->
        @$el.html(@template())
        setTimeout( =>
            @$("input").focus()
        , 500)
        this

    events:
        "click .btn-primary": "requestLink"
        "submit form": "requestLink"

    requestLink: (e) ->
        e.preventDefault()
        originalLink = @$el.find("input").val()
        if originalLink.length is 0
            return
        console.log "requesting", originalLink
        $.get("/api/findSong", originalLink: originalLink).done( (res) ->
            window.location.href = "/song/#{res}"
        )
        

