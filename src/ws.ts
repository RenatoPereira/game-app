import { eventHandler } from "vinxi/http";

export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      console.log("open", peer);
    },
    async message(peer, msg) {
      const message = msg.text();
      console.log("msg", peer, message);
    },
    async close(peer, details) {
      console.log("close", peer);
    },
    async error(peer, error) {
      console.log("error", peer, error);
    },
  },
});