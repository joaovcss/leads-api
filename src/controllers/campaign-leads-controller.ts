import type { Handler } from "express";
import { prisma } from "../lib/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemes/campaign-request-schemes.ts";

export class campaignLeadsController {
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const query = GetCampaignLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const pageNumber = Number(page)
      const pageSizeNumber = Number(pageSize)

      const where: Prisma.LeadWhereInput = {
        campaigns: {
          some: { campaignId }
        }
      }

      if(name) where.name = { contains: name, mode: "insensitive" }
      if(status) where.campaigns = { some: { status }}

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        include: {
          campaigns: {
            select: {
              campaignId: true,
              leadId: true,
              status:true
            }
          }
        }
      })

      const total = await prisma.lead.count({ where })

      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber)
        }
      })
    } catch (error) {
      next(error)
    }
  }

  addLead: Handler = async (req, res, next) => {
    try {
      const body = AddLeadRequestSchema.parse(req.body)
      if(body.status === undefined) body.status = "New"

      await prisma.leadCampaign.create({
        data: {
          campaignId: Number(req.params.campaignId),
          leadId: body.leadId,
          status: body.status
        }
      })
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const body = UpdateLeadStatusRequestSchema.parse(req.body)
      const updatedLeadCampaign = await prisma.leadCampaign.update({
        where: {
          leadId_campaignId: {
            campaignId: Number(req.params.campaignId),
            leadId: Number(req.params.leadId)
          }
        },
        data: body
      })
      res.json({ updatedLeadCampaign })
    } catch (error) {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try {
      const removedLead = await prisma.leadCampaign.delete({
        where: {
          leadId_campaignId: {
            campaignId: Number(req.params.campaignId),
            leadId: Number(req.params.leadId)
          }
        }
      })
      res.json({ removedLead })
    } catch (error) {
      next(error)
    }
  }
}