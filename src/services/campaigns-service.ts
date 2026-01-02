import { HttpError } from "../errors/HttpError.ts";
import type { CampaignRepository, LeadCampaignStatus } from "../repositories/campaigns-repository.ts";
import type { LeadsRepository, LeadWhereParams } from "../repositories/leads-repository.ts";

interface CreateCampaignParams {
  name: string
  description: string
  startDate: Date
  endDate?: Date
}

interface GetCampaignLeadsWithPaginationParams {
  page?: number
  pageSize?: number
  name?: string
  status?: LeadCampaignStatus
  sortBy?: "name" | "status" | "createdAt"
  order?: "asc" | "desc"
}

export class CampaignsService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly leadsRepository: LeadsRepository
  ) { }

  async findAllCampaigns() {
    const allCampaigns = await this.campaignRepository.find()
    return allCampaigns
  }

  async findCampaignById(id: number) {
    const campaign = await this.campaignRepository.findById(id)
    if(!campaign) throw new HttpError(404, "campaign not found")
    return campaign
  }

  async createCampaign(params: CreateCampaignParams) {
    const newCampaign = await this.campaignRepository.create(params)
    return newCampaign
  }

  async updateCampaignById(id: number, params: Partial<CreateCampaignParams>) {
    const updatedCampaign = await this.campaignRepository.update(id, params)
    if(!updatedCampaign) throw new HttpError(404, "campaign not found")
    return updatedCampaign
  }

  async deleteCampaignById(id: number) {
    const deletedCampaign = await this.campaignRepository.delete(id)
    if(!deletedCampaign) throw new HttpError(400, "campaign not found")
    return deletedCampaign
  }

  async getAllCampaignLeads(campaignId: number, params: GetCampaignLeadsWithPaginationParams) {
    const { page = 1, pageSize = 10, name, status, sortBy, order } = params

    const limit = pageSize
    const offset = (page - 1) * limit
    
    const where: LeadWhereParams = { campaignId, campaignStatus: status }
    
    if(name) where.name = { like: name, mode: "insensitive" }
    
    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit,
      offset,
      include: { campaigns: true }
    })
    const total = await this.leadsRepository.count(where)
    return {
      leads,
      meta: {
        page: Number(page),
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async addLeadToCampaign(leadId: number, campaignId: number, status: LeadCampaignStatus) {
    await this.campaignRepository.addLead({ leadId, campaignId, status })
  }

  async updateLeadStatusOnCampaign(leadId: number, campaignId: number, status: LeadCampaignStatus){
    await this.campaignRepository.updateLeadStatus({ leadId, campaignId, status })
  }

  async removeLeadFromCampaign(leadId: number, campaignId: number){
    await this.campaignRepository.removeLead(leadId, campaignId)
  }
}