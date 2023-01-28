import type { NextApiRequest } from 'next'
import type { NextApiResponseWithSocket } from '../../socket/socket'

import { initializeSocket } from '../../socket/init'
import { env } from 'process'

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (
        res.socket.server.io ||
        env.NODE_ENV === 'development'
    ) {
        console.log('Socket is initializing...')
        initializeSocket(res)
    }

    res.end()
}

export default SocketHandler