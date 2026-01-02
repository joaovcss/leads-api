import type { Handler } from "express";
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schemes/leads-request-schemes.ts";
import type { LeadsService } from "../services/leads-service.ts";

export class leadsController {
  constructor(private readonly leadsService: LeadsService) { }

  //GET /leads
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const result = await this.leadsService.getAllLeadsPaginated({
        ...query,
        page: +page, 
        pageSize: +pageSize
      })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  //GET /leads/:id
  show: Handler = async (req, res, next) => {
    try {
      const lead = await this.leadsService.getLeadById(Number(req.params.id))
      res.json(lead)
    } catch (error) {
      next(error)
    }
  }

  //POST /leads
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body)
      const newLead = await this.leadsService.createLead(body)
      res.status(201).json(newLead) 
    } catch (error) {
      next(error)
    }
  }

  //PUT /leads/:id
  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const body = UpdateLeadRequestSchema.parse(req.body)
      const updatedLead = await this.leadsService.updateLeadById(id, body)
      res.json(updatedLead)
    } catch (error) {
      next(error)
    }
  }

  //DELETE /leads/:id
  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const deletedLead = await this.leadsService.deleteLeadById(id)
      res.json({ deletedLead })
    } catch (error) {
      next(error)
    }
  }
}