HomeModel = require '../models/home'

module.exports = class HomeView extends Backbone.View
    model: new HomeModel()
    template: require 'views/templates/home'
    initialize: ->
        @disabled = false

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
        return if @disabled
        @disabled = true
        $.get("/api/findSong", originalLink: originalLink).done( (res) ->
            window.location.href = "/song/#{res}"
        ).fail( (res) =>
            @$(".search-fail").slideDown()
            @disabled = false
            @$(".btn-primary").attr("disabled", "disabled")
            @$("input").on("keydown", =>
                @$(".search-fail").slideUp()
                @$(".btn-primary").removeAttr("disabled")
            )
        )
        
        

