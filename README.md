## chat
A minimal encrypted and authenticated bidirectional chat based on TweetNaCl.js, Javascript and HTML.

### Overview

This project showcases the TweetNaCl.js functionality demonstrated by these four [cryptographic tools](https://metamystical.github.io/) in a browser-to-browser bidirectional chat program. Because it is so minimal, its code can be more easily audited for security. 

The chat connection is established using WebSockets. Because browsers can only function as WebSocket clients, a pass-through WebSocket server is needed as an intermediary between two browsers each acting as a client. There are free WebSocket servers available on the Internet, but one is provided in this project which runs as a Node.js program.

### Server installation and operation
```
$ git clone https://github.com/metamystical/chat.git
$ cd chat
$ npm install ws
$ node server.js
```    
The server listens for client connections on port 12345 by default, but the port can be modified in the file server.js or given as a command line argument. It waits for two connections then begins passing through all data unfiltered and unaltered. If one connection drops, the other is automatically dropped. The server reports its status to the console.

Unless the chat participants are both on a local network, or even on the same computer during testing, the server must be reachable from the public internet. There are several ways to accomplish this.

1. Acquire a static IP address and set up port forwarding if the computer is behind a router.
2. Determine your dynamic IP address using, for example, [myip](https://www.myip.com/) and set up port forwarding if the computer is behind a router.
3. Use [ngrok](https://ngrok.com/) which assigns a free temporary (or paid permanent) public URL to your computer. After installing ngrok, start it with `ngrok http 12345`.

### Client installation and operation
```
$ git clone https://github.com/metamystical/chat.git
$ cd chat
$ brave chat.html # opens chat.html in the brave browser; otherwise open it manually
```                 
Open chat.html in a browser on each of the two client computers. For testing purposes, two chat windows can be opened in the same browser, on the same computer running the server. In this case, the server domain can be set to *localhost* or to the LAN address of the computer.

When chat.html opens, it automatically computes a public key from a random passphrase for the purpose of authenticating the chat. The passphrase can be changed at any time and the public key will be immediately updated.

Click on the *Connect to server* button after changing the default domain/IP and port if necessary (use port 80 when using an ngrok URL). A status message next to the button will indicate whether connection succeeded. If it did, the status will indicate that the local client is waiting for the remote client to also initiate connection. When both clients connect to each other through the server, the status becomes *Contact ready*.

Each of the clients can then begin sending messages. All messages are displayed in the read-only *Chat history* text area, preceded by a timestamp and the sender's public key.

Each message is digitally signed using a secret key derived from the passphrase, and the signature and public key are sent along with the message for verification by the recipient. The recipient will know that the message is authentic if the public key has previously been given by the sender through a secure channel. Unverified messages are not displayed.

Each message is also encrypted, using as an encryption key a temporary shared secret generated using a one-time public key exchange.
