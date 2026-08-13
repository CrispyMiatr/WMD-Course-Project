import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { SightingType } from '~/types';

export const HeatmapLayer = ({ sightings }: { sightings: SightingType[] }) => {
    const map = useMap();

    useEffect(() => {
        const points = sightings.map(s => [
            s.latitude,
            s.longitude,
            0.5
        ] as [number, number, number]);

        const heat = L.heatLayer(points, {
            radius: 30,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
        }).addTo(map);

        return () => {
            map.removeLayer(heat);
        };
    }, [sightings, map]);

    return null;
};