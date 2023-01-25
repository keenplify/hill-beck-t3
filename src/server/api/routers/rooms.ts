import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import dayjs from "dayjs";
import type { Room, User } from "@prisma/client";

export const roomRouter = createTRPCRouter({
  currentRoom: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirstOrThrow({
      where: {
        id: ctx.session.user.id
      },
      include: {
        currentRoom: {
          include: {
            users: true
          }
        },
      }
    })

    if (!user.currentRoom) return null
    return user.currentRoom as Room & {
      users: User[]
    }
  }),

  leaveRoom: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        //@ts-expect-error I know what i am doing
        currentRoomId: null
      }
    })
  }),

  getRooms: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.room.findMany({
      include: {
        owner: true,

      },
      where: {
        updatedAt: {
          gte: dayjs().subtract(10, 'minutes').toDate()
        }
      },
    })
  }),

  createRoom: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.room.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id
        }
      })
    }),

  joinRoom: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          currentRoomId: input
        }
      })
    })
});
