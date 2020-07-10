const Events = require("events");

const event = new Events.EventEmitter();
event.setMaxListeners(500);

export default event;
