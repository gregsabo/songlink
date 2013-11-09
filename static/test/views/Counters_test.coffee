CountersView = require 'views/Counters'

describe 'CountersView', ->
    beforeEach ->
        @view = new CountersView()

    it 'should exist', ->
        expect(@view).to.be.ok
