
user =
  id: 0
  username: 'gandalf'
  realname: 'gandalf the gray'
  email: 'g@nda.lf'
  password: 'secretwhisper'
  gid: 2
  groups: [3, 0]
  state: 'A'

_db = {0: user}
_nextId=1

addItem = (item) ->
  id = _nextId++
  item.id = id
  _db[id] = item
  return item

clone = (obj) ->
  return obj  if obj is null or typeof (obj) isnt "object"
  temp = new obj.constructor()
  for key of obj
    temp[key] = clone(obj[key])
  temp


module.exports = (app) ->

  prefix = '/userman_api'

  app.post "#{prefix}/login", (req, res) ->
    u = user
    u.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mywi"
    res.json(u)

  app.post "#{prefix}/logout", (req, res) ->
    res.json({ message: 'logging out!'})

  app.post "#{prefix}/check", (req, res) ->
      errs = []
      errs.push 0 if req.body.username of _db
      return res.status(200).json(errs)

  app.get "#{prefix}/user", (req, res) ->
    rv = (clone(v) for k, v of _db)
    for i in rv
      delete i.password
    res.json rv

  app.get "#{prefix}/user/:id", (req, res) ->
    found = clone(_db[req.params.id])
    delete found.password
    res.json found

  app.post "#{prefix}/user", (req, res) ->
    req.body.state = 0
    created = addItem(req.body)
    res.json(created)

  app.put "#{prefix}/user/:id", (req, res) ->
    item = _db[req.params.id]
    for k, v of req.body
      item[k] = v
    res.json(item)

  app.delete "#{prefix}/user/:id", (req, res) ->
    delete _db[req.params.id]
    res.status(204).end()

  ######## Groups

  _groups =
    1: {id: 1, name: 'pupils'}
    2: {id: 2, name: 'teachers'}
    3: {id: 3, name: 'admins'}
  _nextid = 4

  app.get "#{prefix}/group", (req, res) ->
    res.json (v for k, v of _groups)

  app.get "#{prefix}/group/:id", (req, res) ->
    found = _db[req.params.id]
    res.json found

  app.post "#{prefix}/group", (req, res) ->
    for k, v of _groups
      return res.status(400).send('ALREADY EXISTS') if v.name == req.name
    req.body.id = _nextid++
    created = _groups[req.body.id] = req.body
    res.json(created)

  app.put "#{prefix}/group/:id", (req, res) ->
    item = _groups[req.params.id]
    for k, v of req.body
      item[k] = v
    res.json(item)

  app.delete "#{prefix}/group/:id", (req, res) ->
    delete _groups[req.params.id]
    res.status(204).end()
