import { leadsController } from "./controllers/lead-controller.ts"
import { groupsController } from "./controllers/group-controller.ts"
import { campaignController } from "./controllers/campaign-controller.ts"
import { campaignLeadsController } from "./controllers/campaign-leads-controller.ts"
import { groupLeadsController } from "./controllers/group-leads-controller.ts"
import { PrismaLeadRepository } from "./repositories/prisma/prisma-lead-repository.ts"
import { PrismaGroupsRepository } from "./repositories/prisma/prisma-groups-repository.ts"
import { PrismaCampaignsRepository } from "./repositories/prisma/prisma-campaigns-repository.ts"
import { LeadsService } from "./services/leads-service.ts"
import { GroupsService } from "./services/groups-service.ts"
import { CampaignsService } from "./services/campaigns-service.ts"

export const leadsRepository = new PrismaLeadRepository()
export const campaignsRepository = new PrismaCampaignsRepository()
export const groupsRepository = new PrismaGroupsRepository()

export const leadsService = new LeadsService(leadsRepository)
export const groupsService = new GroupsService(groupsRepository)
export const campaignsServices = new CampaignsService(campaignsRepository)

export const LeadsController = new leadsController(leadsService)
export const GroupController = new groupsController(groupsService)
export const GroupLeadsController = new groupLeadsController(groupsRepository, leadsRepository)
export const CampaingController = new campaignController(campaignsServices)
export const CampaignLeadsController = new campaignLeadsController(campaignsRepository ,leadsRepository)