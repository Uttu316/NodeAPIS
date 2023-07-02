import express from "express";
import morgan from "morgan";
import db from "./db.mjs";
import * as yup from "./validations.mjs";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/users", (req, res) => {
  res.json({ data: db.users });
});

app.post("/user", (req, res) => {
  try {
    if (!req.body.email) {
      throw new Error("Email is not present");
    }
    if (yup.isAlreadyPresent(db, req.body.email)) {
      throw new Error("User already registered");
    }
    const newUser = { ...req.body, id: Date.now() };

    db.users.push(newUser);

    res.json({ id: newUser.id });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
app.put("/user", (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new Error("User id is not present");
    }
    const userInfo = yup.isUserPresent(db, id);
    if (!userInfo) {
      throw new Error("User not registered");
    }
    const updateUser = { ...userInfo.user, ...req.body };

    db.users[userInfo.index] = updateUser;

    res.json({ message: "User info saved", user: updateUser });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
app.get("/user/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("user id is missing");
    }

    const userInfo = yup.isUserPresent(db, id);

    if (!userInfo) {
      throw new Error("user is not present");
    }

    res.json({ ...userInfo.user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
app.delete("/user/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("user id is missing");
    }

    const userInfo = yup.isUserPresent(db, id);

    if (!userInfo) {
      throw new Error("user is not present");
    }

    db.users.splice(userInfo.index, 1);

    res.json({ data: "User deleted" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default app;
