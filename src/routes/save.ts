import { save } from "controllers"
import express from "express"

const router = express.Router()

router.post("/", save.post)

export default router
