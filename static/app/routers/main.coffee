HomeView = require("../views/home")

activateView = (ViewCls) ->
    homeView = new ViewCls().render()
    $("section.app").empty().append(homeView.el)


class MainRouter extends Backbone.Router
    routes:
        '': "home"
        'counters/new': 'createCounter'

    home: ->
        activateView(HomeView)

    createCounter: ->
        $("section.app").empty().append('<p>create</p>')

main = new MainRouter()
module.exports = main
