import { Router } from "express"
import { leadsController } from "./controllers/lead-controller.ts"
import { groupsController } from "./controllers/group-controller.ts"

const router = Router()
const LeadsController = new leadsController()
const GroupController = new groupsController()

//Leads routes
router.get("/leads", LeadsController.index)
router.get("/leads/:id", LeadsController.show)
router.post("/leads", LeadsController.create)
router.put("/leads/:id", LeadsController.update)
router.delete("/leads/:id", LeadsController.delete)

//Groups routes
router.get("/groups", GroupController.index)
router.get("/groups/:id", GroupController.show)
router.post("/groups", GroupController.create)
router.put("/groups/:id", GroupController.update)
router.delete("/groups/:id", GroupController.delete)

//Server status check
router.get("/status", async (req, res, next) => {
  res.json({ message: " OK "})
})

export { router }