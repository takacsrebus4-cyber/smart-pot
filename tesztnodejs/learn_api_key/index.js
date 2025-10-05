import express from "express";
import { default as router } from "./routes/index.js";
import { verifyToken } from "./middlewares/verifyToken.js";

const app = express();

const port = 3000;


app.use(verifyToken({
  apiToken: "t0k3n",
}));
app.use("/api/0.1", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

