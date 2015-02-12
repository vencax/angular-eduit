
_db = {}

addItem = (item, net) ->
  _db[net] = {} unless _db[net]
  _db[net][item.mac] = item
  return item


net = '192.168.1'

genItems = (cnt) ->
  for idx in [1..cnt]
    item =
      name: "host#{idx}"
      ip: idx+10
      mac: "aaaaaaaaaa#{idx+10}"
      desc: (idx % 4 == 1) && '' || "#{idx}th description"
      state: idx % 2
      res: idx % 4 != 1
    addItem(item, net)

genItems(10)


module.exports = (app) ->

  prefix = '/dhcpdman_api'

  app.get "#{prefix}/dhcphosts/:net", (req, res) ->
    rv = []
    for k, v of _db[req.params.net]
      rv.push v
    res.json(rv)

  app.post "#{prefix}/dhcphosts/:net", (req, res) ->
    req.body.res = true
    created = addItem(req.body, req.params.net)
    res.json(created)

  app.put "#{prefix}/dhcphosts/:net/:dhcphost", (req, res) ->
    item = _db[req.params.net][req.params.dhcphost]
    for k, v of req.body
      item[k] = v
    res.json(item)

  app.delete "#{prefix}/dhcphosts/:net/:dhcphost", (req, res) ->
    item = _db[req.params.net][req.params.dhcphost]
    item.res = false;
    res.json(item)

  app.get "#{prefix}/hoststate/:net/:dhcphost", (req, res) ->
    item = _db[req.params.net][req.params.dhcphost]
    res.json(item.state)

  app.put "#{prefix}/hoststate/:dhcphost", (req, res) ->
    for n,net of _db
      if net[req.params.dhcphost]
        item = _db[req.params.dhcphost]
        
    return res.send 404 unless item?
    item.state = req.body.state
    res.send 200
