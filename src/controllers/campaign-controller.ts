import type { Handler } from "express";
import { CreateCampaignRequestSchema, UpdateCampaignRequestSchema } from "./schemes/campaign-request-schemes.ts";
import { HttpError } from "../errors/HttpError.ts";
import type { CampaignRepository } from "../repositories/campaigns-repository.ts";

export class campaignController {
  constructor (private readonly campaignRepository: CampaignRepository) { }

  //GET /campaigns
  index: Handler = async (req, res, next) => {
    const allCampaigns = await this.campaignRepository.find()
    res.json({allCampaigns})
  }

  //GET /campaigns/:id
  show: Handler = async (req, res, next) => {
    const { id } = req.params
    const campaign = await this.campaignRepository.findById(Number(id))
    if(!campaign) throw new HttpError(404, "campaign not found")
    res.json(campaign)
  }
  
  //POST /campaigns
  create: Handler = async (req, res, next) => {
    const body = CreateCampaignRequestSchema.parse(req.body)
    const newCampaign = await this.campaignRepository.create(body)
    res.status(201).json({newCampaign})
  }

  //PUT /campaigns/:id
  update: Handler = async (req, res, next) => {
    const { id } = req.params
    const body = UpdateCampaignRequestSchema.parse(req.body)

    const updatedCampaign = await this.campaignRepository.update(Number(id), body)

    if(!updatedCampaign) throw new HttpError(404, "campaign not found")

    res.json({ updatedCampaign })
  }

  //DELETE /campaigns/:id
  delete: Handler = async (req, res, next) => {
    const { id } = req.params
    const deletedCampaign = await this.campaignRepository.delete(Number(id))

    if(!deletedCampaign) throw new HttpError(404, "campaign not found")

    res.json({ deletedCampaign })
  }
}