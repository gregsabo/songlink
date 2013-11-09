HomeView = require 'views/home'

describe 'HomeView', ->
    beforeEach ->
        @view = new HomeView()

    it 'should exist', ->
        expect(@view).to.be.ok
