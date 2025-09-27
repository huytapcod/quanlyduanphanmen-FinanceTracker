import express from "express";
import * as ctrl from "../controller/transaction.controller.js";
const router = express.Router();

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.get("/stats", ctrl.stats);
router.get("/:id", (req,res)=>{/* optional get one */});
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;
