import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import { Layout } from '~/Components/common/Layout';
import { SightingDetails, SightingForm } from '~/Components';
import type { MapPageType } from '~/types/pages/mapPage.types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import map from '~styles/pages/map.module.scss';

// Fix for default Leaflet markers missing icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { SightingType } from '~/types';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapClickHandler = ({
    onLocationSelect,
    clearSelection
}: {
    onLocationSelect: (lat: number, lng: number) => void;
    clearSelection: () => void;
}) => {
    useMapEvents({
        click(e) {
            clearSelection(); // Deselect existing pin
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const Map = ({ status, sightings }: MapPageType) => {
    const { auth } = usePage().props as any; // User login check
    const [newLocation, setNewLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedSighting, setSelectedSighting] = useState<SightingType | null>(null);


    return (
        <div className={map['map-container']}>
            <Head title="Neighborhood Map" />

            <div className={map['map-layout']}>
                <section className={map['map']} id='map'>
                    <MapContainer
                        center={[50.842207, 4.322723]}
                        zoom={16}
                        className={map['leaflet-container']}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {auth.user && (
                            <MapClickHandler
                                onLocationSelect={(lat, lng) => setNewLocation({ lat, lng })}
                                clearSelection={() => setSelectedSighting(null)}
                            />
                        )}

                        {sightings.map(sighting => (
                            <Marker
                                key={sighting.id}
                                position={[sighting.latitude, sighting.longitude]}
                                eventHandlers={{
                                    click: () => {
                                        setNewLocation(null); // Close 'new form' if open
                                        setSelectedSighting(sighting); // Show details in sidebar
                                    }
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -30]}>
                                    <strong>{sighting.type === 'person' ? 'Person' : sighting.details.entity_type}</strong>
                                    <p style={{ margin: '5px 0' }}>{sighting.short_description}</p>
                                </Tooltip>
                            </Marker>
                        ))}

                        {newLocation && (
                            <Marker position={[newLocation.lat, newLocation.lng]}>
                                <Tooltip permanent direction="top" offset={[0, -30]}>
                                    New sighting location
                                </Tooltip>
                            </Marker>
                        )}
                    </MapContainer>
                </section>

                <aside className={map['sidebar']}>
                    {selectedSighting ? (
                        <SightingDetails
                            sighting={selectedSighting}
                            onClose={() => setSelectedSighting(null)}
                        />
                    ) : newLocation ? (
                        <SightingForm
                            lat={newLocation.lat}
                            lng={newLocation.lng}
                            onSuccess={() => setNewLocation(null)}
                        />
                    ) : !auth.user ? (
                        <div className={map['sidebar__message']}>
                            <p>Please log in to register a sighting.</p>
                        </div>
                    ) : (
                        <div className={map['sidebar__message']}>
                            <p>Click anywhere on the map to pin a suspicious sighting.</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

Map.layout = (page: React.ReactNode) => <Layout children={page} hideFooter={true} />;

export default Map;