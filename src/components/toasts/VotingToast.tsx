export const VotingToast = () => {
    return <div className="flex justify-between items-center">
        <p>Would you grant permission to the latest land partition?</p>
        <div className="flex flex-col gap-2 p-2">
            <button className="btn btn-primary btn-sm w-max">Yes</button>
            <button className="btn btn-secondary btn-sm">No</button>
        </div>
    </div>
}