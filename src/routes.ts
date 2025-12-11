import { Router } from "express"
import { leadsController } from "./controllers/lead-controller.ts"

const router = Router()
const LeadsController = new leadsController()

router.get("/leads", LeadsController.index)
router.get("/leads/:id", LeadsController.show)
router.post("/leads", LeadsController.create)
router.put("/leads/:id", LeadsController.update )
router.delete("/leads/:id", LeadsController.delete)



router.get("/status", async (req, res, next) => {
  res.json({ message: " OK "})
})

export { router }