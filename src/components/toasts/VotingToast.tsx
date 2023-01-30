import { useSocketIOStore } from "../../stores/socketio";

interface Props {
    partitionId: string
    userId: string
    roomId: string
}

export const VotingToast = ({ partitionId, userId, roomId }: Props) => {
    const { socket } = useSocketIOStore();

    const vote = (isAgree: boolean) => {
        socket.emit('create-vote', { isAgree, partitionId, userId, roomId })
    }

    return <div className="flex justify-between items-center">
        <p>Would you grant permission to the latest land partition?</p>
        <div className="flex flex-col gap-2 p-2">
            <button className="btn btn-primary btn-sm w-max" onClick={() => vote(true)}>Yes</button>
            <button className="btn btn-secondary btn-sm" onClick={() => vote(false)}>No</button>
        </div>
    </div>
}