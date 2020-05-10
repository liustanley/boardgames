import { ExpressServer } from "./ExpressServer";
import { SocketType } from "../types/constants";

let app = new ExpressServer().addSocket(SocketType.CHAT).app;

export { app };
