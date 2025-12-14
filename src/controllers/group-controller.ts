import type { Handler } from "express";
import { prisma } from "../lib/prisma.ts";
import { HttpError } from "../errors/HttpError.ts";
import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from "./schemes/groups-request-schemes.ts";

export class groupsController {

  //GET /groups
  index: Handler = async (req, res, next) => {
    try {
      const groups = await prisma.group.findMany()
      res.json(groups)
    } catch (error) {
      next(error)
    }
  }

  //GET /groups/:id
  show: Handler = async (req, res, next) => {
    try {
      const group = await prisma.group.findUnique({
      where: { id: Number(req.params.id) },
      include: { leads: true }
    })

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

      if(body.description === undefined) body.description = ""

      const newGroup = await prisma.group.create({ data: body })
      res.status(201).json(newGroup)
    } catch (error) {
      next(error)
    }
  }

  //PUT /groups/:id
  update: Handler = async (req, res, next) => {
    try {
      const body = UpdateGroupRequestSchema.parse(req.body)
      const group = await prisma.group.findUnique({ where: { id: Number(req.params.id) }})
      
      if(!group) throw new HttpError(404, "group not found")

      const dataToUpdate = Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined)
      )
      
      const updatedGroup = await prisma.group.update({
        data: dataToUpdate,
        where: { id: Number(req.params.id)}
      })
      res.json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }

  //DELETE /groups/:id
  delete: Handler = async (req, res, next) => {
    const group = await prisma.group.findUnique({
      where: { id: Number(req.params.id) }
    })

    if(!group) throw new HttpError(404, "group not found")

    const deletedGroup = await prisma.group.delete({
      where: { id: Number(req.params.id) }
    })
    res.json({ deletedGroup })
  }
}