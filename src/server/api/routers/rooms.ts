import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import z from 'zod'
import dayjs from "dayjs";
import type { LandPartition, Room, User } from "@prisma/client";

export const roomRouter = createTRPCRouter({
  currentRoom: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirstOrThrow({
      where: {
        id: ctx.session.user.id
      },
      include: {
        currentRoom: {
          include: {
            users: true,
            owner: true,
            landPartitions: {
              include: {
                owner: true
              }
            }
          }
        },
      }
    })

    if (!user.currentRoom) return null
    return user.currentRoom as Room & {
      users: User[],
      owner: User,
      landPartitions: (LandPartition & {
        owner: User
      })[]
    }
  }),

  getRoom: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.room.findFirstOrThrow({
      where: {
        id: input
      },
      include: {
        users: true,
        owner: true,
        landPartitions: {
          include: {
            owner: true
          }
        }
      }
    })
  }),

  getRooms: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany({
      include: {
        owner: true,
      },
      where: {
        status: 'Lobby',
        updatedAt: {
          gte: dayjs().subtract(10, 'minutes').toDate()
        }
      },
    })
  }),

  getHistory: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany({
      include: {
        owner: true,
      },
      where: {
        status: 'Done',
        ownerId: ctx.session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }),
});
