import { Accessory } from "./deps.ts";

const outlet = new Accessory();
outlet.publish();

outlet.postMessage({ hello: "moto" });
outlet.onmessage = (event) => {
  console.log(event);
};
