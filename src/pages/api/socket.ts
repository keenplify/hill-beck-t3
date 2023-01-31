import type { NextApiRequest } from 'next'
import type { NextApiResponseWithSocket } from '../../socket/socket'

import { initializeSocket } from '../../socket/init'

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (!res.socket.server.io) {
        initializeSocket(res)
    }

    res.end()
}

export default SocketHandler