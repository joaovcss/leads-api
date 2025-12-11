import type { Handler } from "express";
import { prisma } from "../lib/prisma.ts";
import { HttpError } from "../errors/HttpError.ts";
import { CreateLeadRequestSchema, UpdateLeadRequestSchema } from "./schemes/leads-request-schemes.ts";

export class leadsController {

  //GET /leads
  index: Handler = async (req, res, next) => {
    try {
      const leads = await prisma.lead.findMany()
      res.json(leads)
    } catch (error) {
      next(error)
    }
  }

  //GET /leads/:id
  show: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: Number(req.params.id)},
        include: {
          campaigns: true,
          groups: true
        }
      })

      if(!lead) throw new HttpError(404, "lead not found")
      res.json(lead)

    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body)
      const newLead = await prisma.lead.create({
        data: body
      })
      res.status(201).json(newLead) 
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const body = UpdateLeadRequestSchema.parse(req.body)


      const lead = await prisma.lead.findUnique({
        where : { id: Number(id)}
      })
      if(!lead) throw new HttpError(404, "lead not found")

      const dataToUpdate = Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined)
      )

      const updatedLead = await prisma.lead.update({
        data: dataToUpdate, // dataToUpdate agora está limpo de 'undefined'
        where: { id: Number(id)}
      })
      
      res.json(updatedLead)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.delete({
        where: { id: Number(req.params.id)}
      })
      res.json(lead)
    } catch (error) {
      next(error)
    }
  }
}