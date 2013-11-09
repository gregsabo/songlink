HomeModel = require 'models/home'

describe 'HomeModel', ->
    beforeEach ->
        @model = new HomeModel()

    it 'should exist', ->
        expect(@model).to.be.ok
