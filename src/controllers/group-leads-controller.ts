import type { Handler } from "express";
import { AddGroupLeadsRequestSchema, GetGroupLeadsRequestSchema } from "./schemes/groups-request-schemes.ts";
import type { GroupsService } from "../services/groups-service.ts";

export class groupLeadsController {
  constructor(private readonly groupsServices: GroupsService) { }

  //GET groups/:groupId/leads
  showLeads: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId)
      const query = GetGroupLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, sortBy = "name", order = "asc" } = query

      const result = await this.groupsServices.getAllGroupLeads(
        groupId,
        {
          ...query,
          page: +page,
          pageSize: +pageSize
        }
      )
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  //POST /groups/:groupId/leads
  addLead: Handler = async (req, res, next) => {
    try {
      const { leadId } = AddGroupLeadsRequestSchema.parse(req.body)
      const groupId = Number(req.params.groupId)
      const updatedGroup = await this.groupsServices.addLeadToGroup(groupId,leadId)
      res.status(201).json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }

  //DELETE /groups/:groupId/leads/:leadId
  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId)
      const leadId = Number(req.params.leadId)
      const updatedGroup = await this.groupsServices.removeLeadFromGroup(groupId, leadId)
      res.json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }
}