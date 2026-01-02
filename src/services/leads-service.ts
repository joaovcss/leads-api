import { HttpError } from "../errors/HttpError.ts"
import type { LeadsRepository, LeadStatus, LeadWhereParams } from "../repositories/leads-repository.ts"

interface GetLeadsWithPaginationParams {
  page?: number
  pageSize?: number
  name?: string
  status?: LeadStatus
  sortBy?: "name" | "status" | "createdAt"
  order?: "asc" | "desc"
}

interface CreateLeadParams {
  name: string
  email: string
  phone: string
  status?: LeadStatus
}

export class LeadsService {
  constructor (private readonly leadsRepository: LeadsRepository) { }

  async getAllLeadsPaginated(params: GetLeadsWithPaginationParams) {
      const { page = 1, pageSize = 10, name, status, sortBy, order } = params

      const limit = pageSize
      const offset = (page - 1) * limit

      const where: LeadWhereParams = {}

      if(name) where.name = { like: name, mode: "insensitive" }
      if(status) where.status = status

      const leads = await this.leadsRepository.find({ where, sortBy, order, limit, offset })
      const total = await this.leadsRepository.count(where)

      return {
        data: leads,
        meta: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  async getLeadById(id: number) {
    const lead = await this.leadsRepository.findById(id)
    if(!lead) throw new HttpError(404, "lead not found")
    return lead
  }

  async createLead(params: CreateLeadParams) {
    if(!params.status) params.status = "New"
    const newLead = await this.leadsRepository.create(params)
    return newLead
  }

  async updateLeadById(id: number, params: Partial<CreateLeadParams>) {
    const lead = await this.leadsRepository.findById(id)
    if(!lead) throw new HttpError(404, "lead not found")
    
    if(lead.status === "New" && params.status !== undefined && params.status !== "Contacted"){
      throw new HttpError(400, "a new lead must be contacted before updating the status to other values")
    }

    if(params.status && params.status === "Archived"){
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - lead.updatedAt.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if(diffDays < 180) throw new HttpError(400, "a lead only can be archived after 6 months of inactivity")
    }

    const updatedLead = await this.leadsRepository.updateById(id, params)

    return updatedLead
  }

  async deleteLeadById(id: number) {
    const leadExists = await this.leadsRepository.findById(Number(id))
    if(!leadExists) throw new HttpError(404, "lead not founded")
    const deletedLead = await this.leadsRepository.deleteById(Number(id))
    return deletedLead
  }
}