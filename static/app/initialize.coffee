# Load App Helpers
require 'lib/helpers'

# Initialize Router
require 'routers/main'
window.iOS = Boolean(navigator.userAgent.match(/(iPad|iPhone|iPod)/g))

$ ->
    # Initialize Backbone History
    Backbone.history.start pushState: yes
