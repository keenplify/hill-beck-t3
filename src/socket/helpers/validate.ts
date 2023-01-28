import type { z, ZodSchema } from "zod";
import { prisma } from "../../server/db";
import type { SocketIOSocket } from "../socket";

export function validatePayload<T extends ZodSchema>(socket: SocketIOSocket, schema: T, data: unknown) {
    try {
        const parsed = schema.parse(data) as z.infer<typeof schema>

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parsed
    } catch (error) {
        throw socket.emit('exception', error)
    }
}

export async function getUser(socket: SocketIOSocket, id: string) {
    try {
        return await prisma.user.findFirstOrThrow({
            where: {
                id
            }
        })
    } catch (error) {
        throw socket.emit('exception', error)
    }
}