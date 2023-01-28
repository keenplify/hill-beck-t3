import type { ReactNode } from "react"

interface Props {
    children: ReactNode
}

export function MainContainer({ children }: Props) {
    return <main className="flex bg-gradient-to-b from-[#2e026d] to-[#15162c] min-h-[calc(100vh-4rem)] w-full text-white flex-col items-center">
        {children}
    </main>
}