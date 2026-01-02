import { HttpError } from "../errors/HttpError.ts";
import type { GroupsRepository } from "../repositories/groups-repository.ts";
import type { LeadsRepository, LeadWhereParams } from "../repositories/leads-repository.ts";

interface CreateGroupParams {
  name: string
  description: string
}

interface GetAllGroupLeadsWithPaginationParams {
  page?: number
  pageSize?: number
  name?: string
  sortBy?: "name"
  order?: "asc" | "desc"
}

export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) { }
  async getAllGroups() {
    const groups = await this.groupsRepository.find()
    return groups
  }
  
  async getGroupById(id: number) {
    const group = await this.groupsRepository.findById(id)
    if(!group) throw new HttpError(404, "group not found")
    return group
  }

  async createGroup(params: CreateGroupParams) {
    const newGroup = await this.groupsRepository.create(params)
    return newGroup
  }

  async updateGroupById(id: number, params: Partial<CreateGroupParams>) {
    const updatedGroup = await this.groupsRepository.update(id, params)
    if(!updatedGroup) throw new HttpError(404, "group not found")
    return updatedGroup
  }
  
  async deleteGroupById(id: number) {
    const deletedGroup = await this.groupsRepository.deleteById(id)
    if(!deletedGroup) throw new HttpError(404, "group not found")
    return deletedGroup
  }

  
  async getAllGroupLeads(groupId: number, params: GetAllGroupLeadsWithPaginationParams) {
    const { page = 1, pageSize = 10, name, sortBy = "name", order = "asc"} = params
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
    return {
      leads,
      meta: {
        page: Number(page),
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async addLeadToGroup(groupId: number, leadId:number){
    const updatedGroup = await this.groupsRepository.addLead(groupId, leadId)
    return updatedGroup
  }

  async removeLeadFromGroup(groupId: number, leadId: number) {
    const updatedGroup = await this.groupsRepository.removeLead(groupId, leadId)
    return updatedGroup
  }
}