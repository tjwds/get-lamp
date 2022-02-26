## index.js

1. Connect to the websocket at wss://www.jakobmaier.at/lamp_ws
2. Keep the light on
3. Destroy all fun with the power of code

## transmitMessage.js

usage: `node transmitMessage.js [message?] [frequency?] [timeUnit?]`

* **message**: What you actually want to send.  Defaults to "tjwds".
* **frequency**: How often to send it, in milliseconds.  Defaults to 60000.
* **timeUnit**: The "dit duration" — see https://en.wikipedia.org/wiki/Morse_code#Representation,_timing,_and_speeds.  Defaults to 300.
