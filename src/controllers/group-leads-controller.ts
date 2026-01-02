import type { Handler } from "express";
import { AddGroupLeadsRequestSchema, GetGroupLeadsRequestSchema } from "./schemes/groups-request-schemes.ts";
import type { LeadsRepository, LeadWhereParams } from "../repositories/leads-repository.ts";
import type { GroupsRepository } from "../repositories/groups-repository.ts";

export class groupLeadsController {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) { }

  showLeads: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId)
      const query = GetGroupLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, sortBy = "name", order = "asc" } = query

      const limit = Number(pageSize)
      const offset = (Number(page) - 1) * limit

      const where: LeadWhereParams = { groupId }

      if(name) where.name = { like: name, mode: "insensitive" }

      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        order,
        limit,
        offset,
        include: { groups: true }
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
      const { leadId } = AddGroupLeadsRequestSchema.parse(req.body)
      const { groupId } = req.params
      const updatedGroup = await this.groupsRepository.addLead(Number(groupId), leadId)

      res.status(201).json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try {
      const { leadId } = req.params
      const { groupId } = req.params
      const updatedGroup = await this.groupsRepository.removeLead(Number(groupId), Number(leadId))
      res.json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }
}