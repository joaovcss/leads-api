import type { Group } from "../generated/prisma/client.ts";

export interface CreateGroupAttributes {
  name: string
  description: string
}

export interface GroupsRepository {
  find: () => Promise<Group[]>
  findById: (id: number) => Promise<Group | null>
  create: (attributes: CreateGroupAttributes) => Promise<Group>
  update: (id: number, attributes: Partial<CreateGroupAttributes>) => Promise<Group | null>
  deleteById: (id: number) => Promise<Group | null>
}