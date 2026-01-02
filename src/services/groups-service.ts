import { HttpError } from "../errors/HttpError.ts";
import type { GroupsRepository } from "../repositories/groups-repository.ts";

interface CreateGroupParams {
  name: string
  description: string
}

export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) { }
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
}