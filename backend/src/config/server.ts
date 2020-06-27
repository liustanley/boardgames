import { ExpressServer } from "./ExpressServer";

let app = new ExpressServer().addSocket().app;

export { app };
