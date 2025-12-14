import type { Handler } from "express";
import { prisma } from "../lib/prisma.ts";
import { CreateCampaignRequestSchema, UpdateCampaignRequestSchema } from "./schemes/campaign-request-schemes.ts";
import { HttpError } from "../errors/HttpError.ts";

export class campaignController {
  //GET /campaigns
  index: Handler = async (req, res, next) => {
    const allCampaigns = await prisma.campaign.findMany()
    res.json({allCampaigns})
  }

  //GET /campaigns/:id
  show: Handler = async (req, res, next) => {
    const { id } = req.params
    const campaignExists = await prisma.campaign.findUnique({ where: { id: Number(id)} })

    if(!campaignExists) throw new HttpError(404, "campaign not found")

    const campaign = await prisma.campaign.findUnique({ where: { id: Number(id)} })
    res.json(campaign)
  }
  
  //POST /campaigns
  create: Handler = async (req, res, next) => {
    const body = CreateCampaignRequestSchema.parse(req.body)

    const newCampaign = await prisma.campaign.create({
      data: {
        name: body.name,
        description: body.description,
        startDate: body.startDate,
        endDate: body.endDate ?? null
      }
    })

    res.status(201).json({newCampaign})
  }

  //PUT /campaigns/:id
  update: Handler = async (req, res, next) => {
    const { id } = req.params
    const campaignExists = await prisma.campaign.findUnique({ where: { id: Number(id)} })

    if(!campaignExists) throw new HttpError(404, "campaign not found")

    const body = UpdateCampaignRequestSchema.parse(req.body)

    const dataToUpdate = Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined)
    )

    const updatedCampaign = await prisma.campaign.update({
      where: { id: Number(id) },
      data: dataToUpdate
    })

    res.json({ updatedCampaign })
  }

  //DELETE /campaigns/:id
  delete: Handler = async (req, res, next) => {
    const { id } = req.params
    const campaignExists = await prisma.campaign.findUnique({ where: { id: Number(id)} })

    if(!campaignExists) throw new HttpError(404, "campaign not found")

    const deletedCampaign = await prisma.campaign.delete({ where: { id: Number(id)} })
    res.json({ deletedCampaign })
  }
}