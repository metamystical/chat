## chat
A minimal encrypted and authenticated bidirectional chat based on TweetNaCl.js, Javascript and HTML.

### Overview

This project showcases the TweetNaCl.js functionality demonstrated by these four [tools](https://metamystical.github.io/) in a browser-to-browser bidirectional chat program. Because it is so minimal, its code can be more easily audited for security. 

The chat connection between two browsers is established using WebSockets. Because browsers can only function as WebSocket clients, a pass through WebSocket server is needed as an intermediary between two browsers each acting as a client. There are free WebSocket servers available on the Internet, but one is provided in this project which runs as a Node.js program. It must run on a computer that has a known IP address or domain name, with port forwarding if it is behind a router. It can be run on the same computer as one of the browsers, if this condition is met, but can also be run on a third computer.

### Server installation
```
$ git clone https://github.com/metamystical/chat.git
$ cd chat
$ npm install ws
$ node server.js
```    
The server listens for client connections on port 12345 by default, but the port can be modified in the file server.js or given as the first command line argument. It waits for two connections then begins passing through all data unfiltered and unaltered. If one connection drops, the other is automatically dropped.

### Client installation
```
$ git clone https://github.com/metamystical/chat.git
$ cd chat
$ brave chat.html # to open chat.html if you have the brave browser; otherwise open it manually
```                 
### Operation

Start the server first. If it starts successfully, it will indicate in the console that it is listening for connections on the designated port. As the two browser connections are made, it will indicate each of them.

Open chat.html in a browser on each of the two client computers. The order does not matter. For testing purposes, two chat windows can be opened in the same browser, on the same computer running the server. In this case, the server domain can be set to *localhost* or to the LAN or external IP address of the computer.

When chat.html opens, it automatically computes a public key from a random passphrase for the purpose of authenticating the chat. The passphrase can be changed at any time and the public key will be updated.

Click on the *Connect to server* button after changing the default domain/IP and port if necessary. A status message next to the button will indicate whether connection succeeded. If it did, the status will indicate that the client is waiting for the contact to also initiate connection. When both clients are connected to each other through the server, the status will be *Contact ready*.

Each of the clients can then begin sending messages. All messages are displayed at the bottom of the chat window, preceded by a timestamp and the sender's public key.

Each message is digitally signed using a secret key derived from the passphrase, and the signature and public key are sent along with the message for verification by the recipient. The recipient will know that the message is authentic if the public key has previously been given by the sender through a secure channel, such as in-person. Unverified messages are not displayed.

Each message is also encrypted, using as an encryption key a temporary shared secret generated using a temporary public key exchange (Curve25519).
