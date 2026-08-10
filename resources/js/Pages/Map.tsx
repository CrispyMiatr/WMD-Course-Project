import { Head } from '@inertiajs/react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Layout } from '~/Components/common/Layout';
import 'leaflet/dist/leaflet.css';
import styles from '~styles/pages/map.module.scss';
import { MapPageType } from '~/types';

const Map = ({ status, sightings }: MapPageType) => {
    return (
        <div className={styles['map-container']}>
            <Head title="Neighborhood Map" />

            <section className={styles['map-section']} id='map'>
                <MapContainer
                    center={[50.842207, 4.322723]}
                    zoom={16}
                    className={styles['leaflet-container']}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </section>
        </div>
    );
};

Map.layout = (page: React.ReactNode) => <Layout children={page} hideFooter={true} />;

export default Map;