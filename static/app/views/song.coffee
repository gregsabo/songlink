module.exports = class SongView extends Backbone.View
    template: require 'views/templates/song'
    initialize: ->
        @listenTo @model, "sync", @render, @
        @model.fetch()

    render: ->
        console.log "rendering", @model.attributes
        
        @$el.html(@template(@model.attributes))
        this
