import type { Group } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";
import type { CreateGroupAttributes, GroupsRepository } from "../groups-repository.ts";

export class PrismaGroupsRepository implements GroupsRepository{
  async find(): Promise<Group[]> {
    return prisma.group.findMany()
  }

  async findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({
      where: { id },
      include: {
        leads: true
      }
    })
  }

  async create(attributes: CreateGroupAttributes): Promise<Group>{
    return prisma.group.create({ data: attributes })
  }

  async update(id: number, attributes: Partial<CreateGroupAttributes>): Promise<Group | null>{
    const groupExists = await prisma.group.findUnique({ where: { id }})
    if(!groupExists) return null
    return prisma.group.update({
      data: attributes,
      where: { id }
    })
  }

  async deleteById(id: number): Promise<Group | null>{
    const groupExists = await prisma.group.findUnique({ where: { id }})
    if(!groupExists) return null
    return prisma.group.delete({ where: { id }})
  }

  async addLead(groupId: number, leadId: number): Promise<Group>{
    return prisma.group.update({
      where: { id: groupId },
      data:{
        leads: { connect: { id: leadId }}
      },
      include: { leads: true }
    })
  }

  async removeLead(groupId: number, leadId: number): Promise<Group>{
    return prisma.group.update({
      where: { id: groupId },
      data:{
        leads: { disconnect: { id: leadId }}
      },
      include: { leads: true }
    })
  }
}