import { leadsController } from "./controllers/lead-controller.ts"
import { groupsController } from "./controllers/group-controller.ts"
import { campaignController } from "./controllers/campaign-controller.ts"
import { campaignLeadsController } from "./controllers/campaign-leads-controller.ts"
import { groupLeadsController } from "./controllers/group-leads-controller.ts"
import { PrismaLeadRepository } from "./repositories/prisma/prisma-lead-repository.ts"
import { PrismaGroupsRepository } from "./repositories/prisma/prisma-groups-repository.ts"

export const leadsRepository = new PrismaLeadRepository()
export const LeadsController = new leadsController(leadsRepository)

export const groupsRepository = new PrismaGroupsRepository()
export const GroupController = new groupsController(groupsRepository)

export const CampaingController = new campaignController()
export const CampaigLeadsController = new campaignLeadsController()
export const GroupLeadsController = new groupLeadsController()