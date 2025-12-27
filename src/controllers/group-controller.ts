import type { Handler } from "express";
import { HttpError } from "../errors/HttpError.ts";
import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from "./schemes/groups-request-schemes.ts";
import type { GroupsRepository } from "../repositories/groups-repository.ts";

export class groupsController {
  constructor(private readonly groupsRepository: GroupsRepository) { }

  //GET /groups
  index: Handler = async (req, res, next) => {
    try {
      const groups = await this.groupsRepository.find()
      res.json(groups)
    } catch (error) {
      next(error)
    }
  }

  //GET /groups/:id
  show: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const group = await this.groupsRepository.findById(Number(id))
      if(!group) throw new HttpError(404, "group not found")
      res.json(group)
    } catch (error) {
      next(error)
    }
  }

  //POST /groups
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body)
      const newGroup = await this.groupsRepository.create(body)
      res.status(201).json(newGroup)
    } catch (error) {
      next(error)
    }
  }

  //PUT /groups/:id
  update: Handler = async (req, res, next) => {
    try {
      const body = UpdateGroupRequestSchema.parse(req.body)
      const { id } = req.params
      const updatedGroup = await this.groupsRepository.update(Number(id), body)
      if(!updatedGroup) throw new HttpError(404, "group not found")
      res.json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }

  //DELETE /groups/:id
  delete: Handler = async (req, res, next) => {
    const deletedGroup = await this.groupsRepository.deleteById(Number(req.params.id))
    if(!deletedGroup) throw new HttpError(404, "group not found")
    res.json({ deletedGroup })
  }
}