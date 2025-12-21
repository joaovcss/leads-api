import type { Handler } from "express";
import { prisma } from "../lib/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { AddGroupLeadsRequestSchema, GetGroupLeadsRequestSchema } from "./schemes/groups-request-schemes.ts";

export class groupLeadsController {
  showLeads: Handler = async (req, res, next) => {
    try {
      const groupId = Number(req.params.groupId)
      const query = GetGroupLeadsRequestSchema.parse(req.query)
      const { page = "1", pageSize = "10", name, sortBy = "name", order = "asc" } = query

      const pageNumber = Number(page)
      const pageSizeNumber = Number(pageSize)

      const where: Prisma.LeadWhereInput = {
        groups: {
          is: { id: groupId}
        }
      }

      if(name) where.name = { contains: name, mode: "insensitive" }

      const leads = await prisma.lead.findMany({
        where,
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        orderBy: { [sortBy]: order},
        include: {
          groups: {
            select: {
              id: true,
              name: true,
              description: true,

            }
          }
        }
      })

      const total = await prisma.lead.count({ where })
      res.json({
        leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber)
        }
      })
    } catch (error) {
      next(error)
    }
  }

  addLead: Handler = async (req, res, next) => {
    try {
      const body = AddGroupLeadsRequestSchema.parse(req.body)
      const updatedGroup = await prisma.group.update({
        where: {
          id: Number(req.params.groupId)
        },
        data: {
          leads: {
            connect: { id: body.leadId }
          }
        },
        include: { leads: true }
      })

      res.status(201).json(updatedGroup)
    } catch (error) {
      next(error)
    }
  }

  removeLead: Handler = async (req, res, next) => {
    try {
      const removeLead = await prisma.group.update({
        where: { id: Number(req.params.groupdId)},
        data: {
          leads: {
            disconnect: { id: Number(req.params.leadId)}
          }
        },
        include: { leads: true }
      })
      res.json(removeLead)
    } catch (error) {
      next(error)
    }
  }
}