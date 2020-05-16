import { ExpressServer } from "./ExpressServer";
import { SocketType } from "../types/constants";

let app = new ExpressServer().addSocket(SocketType.LOVE_LETTER).app;

export { app };
