import type { Handler } from "express";
import { HttpError } from "../errors/HttpError.ts";
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schemes/leads-request-schemes.ts";
import type { LeadsRepository, LeadWhereParams } from "../repositories/leads-repository.ts";

export class leadsController {
  private leadsRepository: LeadsRepository

  constructor(leadsRepository: LeadsRepository){
    this.leadsRepository = leadsRepository
  }

  //GET /leads
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const limit = Number(pageSize)
      const offset = (Number(page) - 1) * limit

      const where: LeadWhereParams = {}

      if(name) where.name = { like: name, mode: "insensitive" }
      if(status) where.status = status

      const leads = await this.leadsRepository.find({ where, sortBy, order, limit, offset })
      const total = await this.leadsRepository.count(where)

      // const leads = await prisma.lead.findMany({
      //   where,
      //   skip: (pageNumber - 1) * pageSizeNumber,
      //   take: pageSizeNumber,
      //   orderBy: { [sortBy]: order }
      // })

      // const total = await prisma.lead.count({ where })

      res.json({
        data: leads,
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

  //GET /leads/:id
  show: Handler = async (req, res, next) => {
    try {
          const lead = await this.leadsRepository.findById(Number(req.params.id))
      // const lead = await prisma.lead.findUnique({
      //   where: { id: Number(req.params.id)},
      //   include: {
      //     campaigns: true,
      //     groups: true
      //   }
      // })

      if(!lead) throw new HttpError(404, "lead not found")
      res.json(lead)

    } catch (error) {
      next(error)
    }
  }

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body)
      const newLead = await this.leadsRepository.create(body)
      // const newLead = await prisma.lead.create({
      //   data: body
      // })
      res.status(201).json(newLead) 
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const body = UpdateLeadRequestSchema.parse(req.body)

      const lead = await this.leadsRepository.findById(Number(id))
      
      if(!lead) throw new HttpError(404, "lead not found")

      if(lead.status === "New" && body.status !== undefined && body.status !== "Contacted"){
        throw new HttpError(400, "a new lead must be contacted before updating the status to other values")
      }

      if(body.status && body.status === "Archived"){
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if(diffDays < 180) throw new HttpError(400, "a lead only can be archived after 6 months of inactivity")
      }

      const dataToUpdate = Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined)
      )

      const updatedLead = await this.leadsRepository.updateById(Number(id), dataToUpdate)
      // const updatedLead = await prisma.lead.update({
      //   data: dataToUpdate, // dataToUpdate agora está limpo de 'undefined'
      //   where: { id: Number(id)}
      // })
      
      res.json(updatedLead)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const leadExists = await this.leadsRepository.findById(Number(id))

      if(!leadExists) throw new HttpError(404, "lead not founded")

      const deletedLead = await this.leadsRepository.deleteById(Number(id))
      res.json({ deletedLead })
    } catch (error) {
      next(error)
    }
  }
}