import type { Handler } from "express";
import { AddLeadRequestSchema, GetCampaignLeadsRequestSchema, UpdateLeadStatusRequestSchema } from "./schemes/campaign-request-schemes.ts";
import type { CampaignRepository } from "../repositories/campaigns-repository.ts";
import type { LeadsRepository, LeadWhereParams } from "../repositories/leads-repository.ts";
import type { CampaignsService } from "../services/campaigns-service.ts";

export class campaignLeadsController {
  constructor(private readonly campaignsServices: CampaignsService) {}
  
  //GET /campaigns/:id/leads
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const query = GetCampaignLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const campaignLeads = await this.campaignsServices.getAllCampaignLeads(
        campaignId,
        {
          ...query,
          page: +page,
          pageSize: +pageSize
        }
      )
      res.json(campaignLeads)
    } catch (error) {
      next(error)
    }
  }

  //POST campaigns/:campaignId/leads
  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId, status = "New"} = AddLeadRequestSchema.parse(req.body)
      const campaignId = Number(req.params.campaignId)
      await this.campaignsServices.addLeadToCampaign(leadId, campaignId, status)
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  //PUT campaigns/:campaignId/leads/:leadId
  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      const { status } = UpdateLeadStatusRequestSchema.parse(req.body)
      await this.campaignsServices.updateLeadStatusOnCampaign(leadId, campaignId, status)
      res.json({ message: "lead status updated successfully"})
    } catch (error) {
      next(error)
    }
  }

  //DELETE campaigns/:campaignId/leads/:leadId
  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)      
      await this.campaignsServices.removeLeadFromCampaign(leadId, campaignId)
      res.json({ message: "lead removed from campaign successfully"})
    } catch (error) {
      next(error)
    }
  }
}