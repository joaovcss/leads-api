import type { Campaign } from "../generated/prisma/client.ts";

export type LeadCampaignStatus = "New" | "Engaged" | "FollowUp_Scheduled" | "Contacted" | "Qualified" |  "Converted" |  "Unresponsive" |  "Disqualified" |  "Re_Engaged" |  "Opted_Out"


export interface CreateCampaignAttributes {
  name: string
  description: string
  startDate: Date
  endDate?: Date
}

export interface CampaignRepository {
  find: () => Promise<Campaign[]>
  findById: (id: number) => Promise<Campaign | null>
  create: (attributes: CreateCampaignAttributes) => Promise<Campaign>
  update: (id: number ,attributes: Partial<CreateCampaignAttributes>) => Promise<Campaign | null>
  delete: (id: number) => Promise<Campaign | null>
  addLead: (leadId: number, campaignId: number) => Promise<Campaign>
  updateLeadStatus: (leadId: number, campaignId: number, status: LeadCampaignStatus) => Promise<Campaign>
  removeLead: (leadId: number, campaignId: number) => Promise<Campaign>
}