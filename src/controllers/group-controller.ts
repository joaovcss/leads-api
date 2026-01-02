import type { Handler } from "express";
import { HttpError } from "../errors/HttpError.ts";
import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from "./schemes/groups-request-schemes.ts";
import type { GroupsRepository } from "../repositories/groups-repository.ts";
import type { GroupsService } from "../services/groups-service.ts";

export class groupsController {
  constructor(private readonly groupsService: GroupsService) { }

  //GET /groups
  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsService.getAllGroups()
      res.json(groups)
    } catch (error) {
      next(error)
    }
  }

  //GET /groups/:id
  show: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const group = await this.groupsService.getGroupById(id)
      res.json(group)
    } catch (error) {
      next(error)
    }
  }

  //POST /groups
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body)
      const newGroup = await this.groupsService.createGroup(body)
      res.status(201).json(newGroup)
    } catch (error) {
      next(error)
    }
  }

  //PUT /groups/:id
  update: Handler = async (req, res, next) => {
    try {
      const body = UpdateGroupRequestSchema.parse(req.body)
      const id = Number(req.params.id)
      const updatedGroup = await this.groupsService.updateGroupById(id, body)
      res.json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }

  //DELETE /groups/:id
  delete: Handler = async (req, res, next) => {
    const id = Number(req.params.id)
    const deletedGroup = await this.groupsService.deleteGroupById(id)
    res.json({ deletedGroup })
  }
}