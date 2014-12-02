
_db = {}

addItem = (item) ->
  _db[item.mac] = item
  return item

user =
  username: 'gandalf'
  first_name: 'gandalf'
  last_name: 'the gray'
  email: 'g@nda.lf'
  password: 'secretwhisper'
  gid_id: 2
  groups: [3, 4]


module.exports = (app) ->

  prefix = '/userman_api'

  app.post "#{prefix}/login", (req, res) ->
    res.json({
      first_name: 'Gandalf', last_name: 'The Gray',
      role: 0, uname: 'gandalf',
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mywi"
    })

  app.post "#{prefix}/logout", (req, res) ->
    res.json({ message: 'logging out!'})

  app.get "#{prefix}/", (req, res) ->
    res.json (v for k, v of _db)

  app.get "#{prefix}/:id", (req, res) ->
    found = _db[req.params.id]
    res.json found

  app.post "#{prefix}/", (req, res) ->
    req.body.res = true
    created = addItem(req.body)
    res.json(created)

  app.put "#{prefix}/:id", (req, res) ->
    item = _db[req.params.id]
    for k, v of req.body
      item[k] = v
    res.json(item)

  app.delete "#{prefix}/:id", (req, res) ->
    item = _db[req.params.id]
    item.res = false;
    res.json(item)
