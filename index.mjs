import app from "./app.mjs";

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`);
});
