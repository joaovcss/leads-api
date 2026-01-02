import { Router } from "express"
import { CampaignLeadsController, CampaingController, GroupController, GroupLeadsController, LeadsController } from "./container.ts"

const router = Router()

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
router.get("/campaigns/:campaignId/leads", CampaignLeadsController.getLeads)
router.post("/campaigns/:campaignId/leads", CampaignLeadsController.addLead)
router.put("/campaigns/:campaignId/leads/:leadId", CampaignLeadsController.updateLeadStatus)
router.delete("/campaigns/:campaignId/leads/:leadId", CampaignLeadsController.removeLead)


//Server status check
router.get("/status", async (req, res, next) => {
  res.json({ message: " OK "})
})

export { router }