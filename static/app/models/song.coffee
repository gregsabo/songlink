module.exports = class Song extends Backbone.Model
    url: ->
        "/api/songInfo/#{@get('id')}"
