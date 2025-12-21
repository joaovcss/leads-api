import { Router } from "express"
import { leadsController } from "./controllers/lead-controller.ts"
import { groupsController } from "./controllers/group-controller.ts"
import { campaignController } from "./controllers/campaign-controller.ts"
import { campaignLeadsController } from "./controllers/campaign-leads-controller.ts"
import { groupLeadsController } from "./controllers/group-leads-controller.ts"

const router = Router()
const LeadsController = new leadsController()
const GroupController = new groupsController()
const CampaingController = new campaignController()
const CampaigLeadsController = new campaignLeadsController()
const GroupLeadsController = new groupLeadsController()

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

// Leads management in groups
router.get("/groups/:groupId/leads", GroupLeadsController.showLeads)
router.post("/groups/:groupId/leads/" , GroupLeadsController.addLead)
router.delete("/groups/:groupdId/leads/:leadId", GroupLeadsController.removeLead)

//Campaings routes
router.get("/campaigns", CampaingController.index)
router.get("/campaigns/:id", CampaingController.show)
router.post("/campaigns", CampaingController.create)
router.put("/campaigns/:id", CampaingController.update)
router.delete("/campaigns/:id", CampaingController.delete)

// Leads management in campaigns
router.get("/campaigns/:campaignId/leads", CampaigLeadsController.getLeads)
router.post("/campaigns/:campaignId/leads", CampaigLeadsController.addLead)
router.put("/campaigns/:campaignId/leads/:leadId", CampaigLeadsController.updateLeadStatus)
router.delete("/campaigns/:campaignId/leads/:leadId", CampaigLeadsController.removeLead)


//Server status check
router.get("/status", async (req, res, next) => {
  res.json({ message: " OK "})
})

export { router }