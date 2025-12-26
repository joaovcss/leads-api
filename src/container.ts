import { leadsController } from "./controllers/lead-controller.ts"
import { groupsController } from "./controllers/group-controller.ts"
import { campaignController } from "./controllers/campaign-controller.ts"
import { campaignLeadsController } from "./controllers/campaign-leads-controller.ts"
import { groupLeadsController } from "./controllers/group-leads-controller.ts"
import { PrismaLeadRepository } from "./repositories/prisma/prisma-lead-repository.ts"

export const leadsRepository = new PrismaLeadRepository()
export const LeadsController = new leadsController(leadsRepository)

export const GroupController = new groupsController()
export const CampaingController = new campaignController()
export const CampaigLeadsController = new campaignLeadsController()
export const GroupLeadsController = new groupLeadsController()