import type { MapOptions } from 'leaflet';
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { Suspense } from 'react'

export const LeafletMapWithClusters: FC<
    {
        center: [number, number]
    } & MapOptions
> = ({ center, ...options }) => {
    return (
        <Suspense fallback={<div className="h-[200px]" />}>
            <LazyMapContainer
                center={center}
                zoom={2}
                className='w-full h-full min-h-[calc(100vh-4rem)]'
                {...options}
            >
                <LazyTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <Suspense fallback={<></>}>
                    <LazyMarkerCluster>
                        {markers.map((position, index) => (
                            <LazyMarker key={index} position={position} />
                        ))}
                    </LazyMarkerCluster>
                </Suspense> */}
            </LazyMapContainer>
        </Suspense>
    )
}

const LazyMapContainer = dynamic(async () => (await import('react-leaflet')).MapContainer, {
    ssr: false
})

const LazyTileLayer = dynamic(async () => (await import('react-leaflet')).TileLayer, {
    ssr: false
})