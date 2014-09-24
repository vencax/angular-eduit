###
Define custom server-side HTTP routes for lineman's development server
These might be as simple as stubbing a little JSON to
facilitate development of code that interacts with an HTTP service
(presumably, mirroring one that will be reachable in a live environment).

It's important to remember that any custom endpoints defined here
will only be available in development, as lineman only builds
static assets, it can't run server-side code.

This file can be very useful for rapid prototyping or even organically
defining a spec based on the needs of the client code that emerge.
###

genItems = (cnt) ->
  rv = []
  for idx in [1..cnt]
    rv.push
      _id: idx
      name: "Item num.#{idx}"
      desc: "#{idx}th description"

  rv

_db = genItems()

module.exports =
  drawRoutes: (app) ->
    app.post '/login', (req, res) ->
      res.json({ message: 'logging in!' })


    app.post '/logout', (req, res) ->
      res.json({ message: 'logging out!'})


    app.get '/books', (req, res) ->
      res.json([
        {title: 'Great Expectations', author: 'Dickens'},
        {title: 'Foundation Series', author: 'Asimov'},
        {title: 'Treasure Island', author: 'Stephenson'}
      ])
