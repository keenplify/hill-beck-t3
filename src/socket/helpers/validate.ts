import type { z, ZodSchema } from "zod";
import { ZodError } from "zod";
import { prisma } from "../../server/db";
import type { SocketIOSocket } from "../socket";

export function validatePayload<T extends ZodSchema>(socket: SocketIOSocket, schema: T, data: unknown) {
    try {
        const parsed = schema.parse(data) as z.infer<typeof schema>

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parsed
    } catch (error) {
        throw emitErrors(socket, error)
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
        throw emitErrors(socket, error)
    }
}

function emitErrors(socket: SocketIOSocket, error: unknown) {
    if (error instanceof ZodError) {
        socket.emit('exception', error.message)
    } else if (error instanceof Error) {
        socket.emit('exception', error.message)
    } else {
        socket.emit('exception', 'Something has gone wrong')
    }
}