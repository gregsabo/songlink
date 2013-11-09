CountersCollection = require 'collections/Counters'

describe 'CountersCollection', ->
    beforeEach ->
        @collection = new CountersCollection()

    it 'should exist', ->
        expect(@collection).to.be.ok
