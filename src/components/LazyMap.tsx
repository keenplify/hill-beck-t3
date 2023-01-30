import dynamic from 'next/dynamic'
import type { FC, ReactNode, RefAttributes } from 'react'
import { Suspense } from 'react'
import type { MapContainerProps } from 'react-leaflet';
import type { Map } from 'leaflet';

import "leaflet/dist/leaflet.css";
import 'leaflet-draw/dist/leaflet.draw.css'

export const LazyLeafletMap: FC<
    {
        children?: ReactNode
    } & MapContainerProps & RefAttributes<Map>
> = ({ center, children, zoom, className, ...options }) => {
    return (
        <Suspense fallback={<div className="h-[200px]" />}>
            <LazyMapContainer
                center={center}
                zoom={zoom ?? 2}
                className={`w-full h-full ${className}`}
                {...options}
            >
                <LazyTileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {children}
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

export const LazyFeatureGroup = dynamic(async () => (await import('react-leaflet')).FeatureGroup, {
    ssr: false
})

export const LazyEditControl = dynamic(async () => (await import('react-leaflet-draw')).EditControl, {
    ssr: false
})

export const LazyPolygon = dynamic(async () => (await import('react-leaflet')).Polygon, {
    ssr: false
})

export const LazyInstanceMapController = dynamic(async () => (await import('./InstanceMapController')).InstanceMapController, {
    ssr: false
})

export const LazyMapController = dynamic(async () => (await import('./MapController')).MapController, {
    ssr: false
})