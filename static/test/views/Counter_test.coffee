CounterView = require 'views/Counter'

describe 'CounterView', ->
    beforeEach ->
        @view = new CounterView()

    it 'should exist', ->
        expect(@view).to.be.ok
