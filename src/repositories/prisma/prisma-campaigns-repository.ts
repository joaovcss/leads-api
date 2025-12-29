import type { Campaign } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";
import type { CampaignRepository, CreateCampaignAttributes, LeadCampaignStatus } from "../campaigns-repository.ts";

export class PrismaCampaignsRepository implements CampaignRepository {
  async find(): Promise<Campaign[]> {
    return prisma.campaign.findMany()
  }

  async findById(id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({ 
      where: { id },
      include: { leads: true }
    })
  }
  async create(attributes: CreateCampaignAttributes): Promise<Campaign> {
    return prisma.campaign.create({
      data: attributes
    })
  }
  async update(id: number, attributes: Partial<CreateCampaignAttributes>): Promise<Campaign | null> {
    return prisma.campaign.update({
      where: { id },
      data: attributes
    })
  }
  async delete(id: number): Promise<Campaign | null> {
    return prisma.campaign.delete({ where: { id }, include: { leads: true }})
  }
  async addLead(leadId: number, campaignId: number): Promise<Campaign> {

  }
  async updateLeadStatus(leadId: number, campaignId: number, status: LeadCampaignStatus): Promise<Campaign> {

  }
  async removeLead(leadId: number, campaignId: number): Promise<Campaign> {

  }
}