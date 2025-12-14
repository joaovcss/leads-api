import { Router } from "express"
import { leadsController } from "./controllers/lead-controller.ts"
import { groupsController } from "./controllers/group-controller.ts"
import { campaignController } from "./controllers/campaign-controller.ts"

const router = Router()
const LeadsController = new leadsController()
const GroupController = new groupsController()
const CampaingController = new campaignController()

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

//Campaings routes
router.get("/campaigns", CampaingController.index)
router.get("/campaigns/:id", CampaingController.show)
router.post("/campaigns", CampaingController.create)
router.put("/campaigns/:id", CampaingController.update)
router.delete("/campaigns/:id", CampaingController.delete)

//Server status check
router.get("/status", async (req, res, next) => {
  res.json({ message: " OK "})
})

export { router }