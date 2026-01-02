import type { Handler } from "express";
import { CreateCampaignRequestSchema, UpdateCampaignRequestSchema } from "./schemes/campaign-request-schemes.ts";
import { HttpError } from "../errors/HttpError.ts";
import type { CampaignsService } from "../services/campaigns-service.ts";

export class campaignController {
  constructor (private readonly campaignsServices: CampaignsService) {}

  //GET /campaigns
  index: Handler = async (req, res, next) => {
    const allCampaigns = await this.campaignsServices.findAllCampaigns()
    res.json({allCampaigns})
  }

  //GET /campaigns/:id
  show: Handler = async (req, res, next) => {
    const id = Number(req.params.id)
    const campaign = await this.campaignsServices.findCampaignById(id)
    res.json(campaign)
  }
  
  //POST /campaigns
  create: Handler = async (req, res, next) => {
    const body = CreateCampaignRequestSchema.parse(req.body)
    const newCampaign = await this.campaignsServices.createCampaign(body)
    res.status(201).json({newCampaign})
  }

  //PUT /campaigns/:id
  update: Handler = async (req, res, next) => {
    const id = Number(req.params.id)
    const body = UpdateCampaignRequestSchema.parse(req.body)
    const updatedCampaign = await this.campaignsServices.updateCampaignById(id,body)
    res.json({ updatedCampaign })
  }

  //DELETE /campaigns/:id
  delete: Handler = async (req, res, next) => {
    const id = Number(req.params.id)
    const deletedCampaign = await this.campaignsServices.deleteCampaignById(id)
    res.json({ deletedCampaign })
  }
}