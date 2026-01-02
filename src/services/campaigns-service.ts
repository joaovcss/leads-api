import { HttpError } from "../errors/HttpError.ts";
import type { CampaignRepository } from "../repositories/campaigns-repository.ts";

interface CreateCampaignParams {
  name: string
  description: string
  startDate: Date
  endDate?: Date
}

export class CampaignsService {
  constructor(private readonly campaignRepository: CampaignRepository) { }

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
}