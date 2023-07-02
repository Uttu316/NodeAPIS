import express from "express";
import morgan from "morgan";
import swaggerConfig from "./swagger.mjs";
import { userService } from "./services/index.mjs";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.json({ data: "Server running" });
});

app.use("/", userService);

app.use("/docs", ...swaggerConfig);

export default app;
