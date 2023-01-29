
import type { NextPage } from "next";
import "leaflet/dist/leaflet.css";
import { LeafletMapWithClusters } from "../components/LazyMap";


const Instance: NextPage = () => {
    return <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <LeafletMapWithClusters center={[0, 0]} />
    </div>
}

export default Instance