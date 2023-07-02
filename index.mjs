import app from "./app.mjs";

app.listen(process.env.PORT, () => {
  console.log("Server on http://localhost:8000");
});
