import type { Handler } from "express";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemes/campaign-request-schemes.ts";
import type { CampaignRepository } from "../repositories/campaigns-repository.ts";
import type { LeadsRepository, LeadWhereParams } from "../repositories/leads-repository.ts";

export class campaignLeadsController {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}
  
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const query = GetCampaignLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const limit = Number(pageSize)
      const offset = (Number(page) - 1) * limit

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

      res.json({
        leads,
        meta: {
          page: Number(page),
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      next(error)
    }
  }

  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId, status = "New"} = AddLeadRequestSchema.parse(req.body)
      const campaignId = Number(req.params.campaignId)
      await this.campaignRepository.addLead({ leadId, campaignId, status })
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body)
      await this.campaignRepository.updateLeadStatus({ leadId, campaignId, status })
      res.json({ message: "lead status updated successfully"})
    } catch (error) {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)      
      await this.campaignRepository.removeLead(leadId, campaignId)
      res.json({ message: "lead removed from campaign successfully"})
    } catch (error) {
      next(error)
    }
  }
}