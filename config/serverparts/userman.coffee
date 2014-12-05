
user =
  id: 0
  username: 'gandalf'
  first_name: 'gandalf'
  last_name: 'the gray'
  email: 'g@nda.lf'
  password: 'secretwhisper'
  gid: 2
  groups: [3, 4]
  state: 0

_db = {0: user}
_nextId=1

addItem = (item) ->
  id = _nextId++
  item.id = id
  _db[id] = item
  return item


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

  app.post "#{prefix}/check", (req, res) ->
      errs = []
      errs.push 0 if req.body.username of _db
      return res.status(200).json(errs)

  app.get "#{prefix}/users", (req, res) ->
    res.json (v for k, v of _db)

  app.get "#{prefix}/users/:id", (req, res) ->
    found = _db[req.params.id]
    res.json found

  app.post "#{prefix}/users", (req, res) ->
    req.body.state = 0
    created = addItem(req.body)
    res.json(created)

  app.put "#{prefix}/users/:id", (req, res) ->
    item = _db[req.params.id]
    for k, v of req.body
      item[k] = v
    res.json(item)

  app.delete "#{prefix}/users/:id", (req, res) ->
    item = _db[req.params.id]
    item.res = false;
    res.json(item)

  ######## Groups

  _groups =
    1: {id: 1, name: 'pupils'}
    2: {id: 2, name: 'teachers'}
    3: {id: 3, name: 'admins'}
  _nextid = 3

  app.get "#{prefix}/groups", (req, res) ->
    res.json (v for k, v of _groups)

  app.get "#{prefix}/groups/:id", (req, res) ->
    found = _db[req.params.id]
    res.json found

  app.post "#{prefix}/groups", (req, res) ->
    return res.status(400).send('ALREADY EXISTS') if req.username of _groups
    req.id = _nextid++
    created = _groups[req.id] = req.body
    res.json(created)

  app.put "#{prefix}/groups/:id", (req, res) ->
    item = _groups[req.params.id]
    for k, v of req.body
      item[k] = v
    res.json(item)

  app.delete "#{prefix}/groups/:id", (req, res) ->
    item = _groups[req.params.id]
    res.json(item)
