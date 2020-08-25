#!/usr/bin/env node

/*
 * Opens a WebSocket port and listens.
 * Once two connections are made, data is passed through bidirectionally.
 * If one of the connections closes, the other is closed and listening resumes.
 * The port is specified by the first command line argument, otherwise a default is used
 */
const WebSocket = require('ws')

const DEFAULT_PORT = 12345
const port = (process.argv.length === 3 ? parseInt(process.argv[2]) : DEFAULT_PORT)
if (isNaN(port) || port < 1024 || port > 65535) {
  console.log('invalid port: ' + process.argv[2])
  process.exit(1)
}

start()
function start () {
  const wss = new WebSocket.Server({ port: port })
  wss.on('listening', () => { console.log('listening on port ' + port) })
  wss.on('error', (err) => { console.log(err) })
  const con = []
  let saved = null
  wss.on('connection', (c) => {
    con.push(c)
    if (con.length > 2) { c.close(); return }
    console.log('connection ' + con.length)
    c.on('message', data => {
      if (con.length === 2) {
        if (saved) { c.send(saved); saved = null }
        other(c).send(data)
      }
      else saved = data
    })
    c.on('close', () => {
      const b = other(c)
      con.fill(null)
      if (b) b.close()
      else wss.close()
    })
  })
  wss.on('close', () => { setImmediate(start) })
  function other (c) { return c === con[0] ? con[1] : con[0] }
}
