import { Router } from "express";
import hello from "./hello.js";

const router = Router();

router.use("/", hello);

export default router;