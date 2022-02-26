const WebSocket = require("ws");

const ws = new WebSocket("wss://www.jakobmaier.at/lamp_ws");

ws.on("message", async function incoming(data) {
  try {
    const message = JSON.parse(data.toString());
    // even means it's off
    if (message.type === "state" && !(message.value % 2)) {
      console.log("Turned it back on");
      ws.send(`{"action":"plus"}`);
    }
  } catch (e) {}
});
