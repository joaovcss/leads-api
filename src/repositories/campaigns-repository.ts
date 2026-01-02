import type { Campaign } from "../generated/prisma/client.ts";

export type LeadCampaignStatus = "New" | "Engaged" | "FollowUp_Scheduled" | "Contacted" | "Qualified" |  "Converted" |  "Unresponsive" |  "Disqualified" |  "Re_Engaged" |  "Opted_Out"

export interface CreateCampaignAttributes {
  name: string
  description: string
  startDate: Date
  endDate?: Date
}

export interface AddLeadToCampaignAttributes {
  leadId: number
  campaignId: number
  status: LeadCampaignStatus
}

export interface CampaignRepository {
  find: () => Promise<Campaign[]>
  findById: (id: number) => Promise<Campaign | null>
  create: (attributes: CreateCampaignAttributes) => Promise<Campaign>
  update: (id: number ,attributes: Partial<CreateCampaignAttributes>) => Promise<Campaign | null>
  delete: (id: number) => Promise<Campaign | null>
  addLead: (attributes: AddLeadToCampaignAttributes) => Promise<void>
  updateLeadStatus: (attributes: AddLeadToCampaignAttributes) => Promise<void>
  removeLead: (leadId: number, campaignId: number) => Promise<void>
}