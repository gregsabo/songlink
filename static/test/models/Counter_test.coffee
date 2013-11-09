CounterModel = require 'models/Counter'

describe 'CounterModel', ->
    beforeEach ->
        @model = new CounterModel()

    it 'should exist', ->
        expect(@model).to.be.ok
