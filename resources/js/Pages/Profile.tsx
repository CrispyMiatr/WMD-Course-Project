import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Layout } from '~/Components';
import type { ProfilePageType } from '~/types';
import styles from '~styles/pages/profile.module.scss';
import 'leaflet/dist/leaflet.css';

const MapClickHandler = ({
    onLocationSelect,
}: {
    onLocationSelect: (lat: number, lng: number) => void;
}) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const Profile = ({ auth, status, sightings, stats }: ProfilePageType) => {
    const user = auth.user;

    // Profile info
    const profileForm = useForm({
        name: user.name,
        username: user.username || '',
        email: user.email,
        home_latitude: user.home_latitude ?? null,
        home_longitude: user.home_longitude ?? null,
        radius_km: user.radius_km ?? 5,
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'));
    };

    // Password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const bannerClass = stats?.uiTheme ? styles[`threat-banner--${stats.uiTheme}`] : '';

    return (
        <div className={styles['profile-container']}>
            <Head title="Profile" />

            <div className={styles['left-col']}>
                <section className={styles['section']}>
                    <h2>{user.name}</h2>
                    <div className={styles['badge-container']}>
                        <span
                            className={styles['rank-badge']}
                            style={{ backgroundColor: user.rank.color }}
                        >
                            {user.rank.label}
                        </span>
                        <p className={styles['rank-subtext']}>
                            Based on your activity this week.
                        </p>
                    </div>
                </section>

                <section className={styles['section']}>
                    <div className={styles['section__header']}>
                        <h3>Home Location & Safety Radius</h3>
                        <p>Set your home to receive personalized neighborhood security alerts.</p>
                    </div>

                    <div className={styles['mini-map-container']} style={{ height: '200px' }}>
                        <MapContainer
                            center={[50.8422, 4.3227]}
                            zoom={13}
                            style={{ height: '100%' }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapClickHandler
                                onLocationSelect={(lat, lng) => {
                                    profileForm.setData(d => ({ ...d, home_latitude: lat, home_longitude: lng }));
                                }}
                            />
                            {profileForm.data.home_latitude !== null && profileForm.data.home_longitude !== null && (
                                <Marker position={[profileForm.data.home_latitude as number, profileForm.data.home_longitude as number]} />
                            )}
                        </MapContainer>
                    </div>

                    <div className={styles['form-group']}>
                        <label>Safety Radius (km): {profileForm.data.radius_km}km</label>
                        <input
                            type="range" min="1" max="20"
                            value={profileForm.data.radius_km}
                            onChange={e => profileForm.setData('radius_km', parseInt(e.target.value))}
                        />
                    </div>

                    <button onClick={submitProfile} className={styles['btn-save']}>Update Preferences</button>
                </section>

                <section className={styles['section']}>
                    <div className={styles['section__header']}>
                        <h3>Profile Information</h3>
                        <p>Update your account's profile information, username, and email address.</p>
                    </div>

                    <form onSubmit={submitProfile}>
                        <div className={styles['form-group']}>
                            <label>Name</label>
                            <input type="text" value={profileForm.data.name} onChange={e => profileForm.setData('name', e.target.value)} required />
                            {profileForm.errors.name && <span className={styles['error']}>{profileForm.errors.name}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label>Username</label>
                            <input type="text" value={profileForm.data.username} onChange={e => profileForm.setData('username', e.target.value)} />
                            {profileForm.errors.username && <span className={styles['error']}>{profileForm.errors.username}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label>Email</label>
                            <input type="email" value={profileForm.data.email} onChange={e => profileForm.setData('email', e.target.value)} required />
                            {profileForm.errors.email && <span className={styles['error']}>{profileForm.errors.email}</span>}
                        </div>

                        <div className="flex items-center gap-4">
                            <button type="submit" disabled={profileForm.processing} className={styles['btn-save']}>Save</button>
                            {status === 'profile-updated' && <span className={styles['success-msg']}>Saved.</span>}
                        </div>
                    </form>
                </section>

                <section className={styles['section']}>
                    <div className={styles['section__header']}>
                        <h3>Update Password</h3>
                        <p>Ensure your account is using a long, random password to stay secure.</p>
                    </div>

                    <form onSubmit={submitPassword}>
                        <div className={styles['form-group']}>
                            <label>Current Password</label>
                            <input type="password" value={passwordForm.data.current_password} onChange={e => passwordForm.setData('current_password', e.target.value)} required />
                            {passwordForm.errors.current_password && <span className={styles['error']}>{passwordForm.errors.current_password}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label>New Password</label>
                            <input type="password" value={passwordForm.data.password} onChange={e => passwordForm.setData('password', e.target.value)} required />
                            {passwordForm.errors.password && <span className={styles['error']}>{passwordForm.errors.password}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label>Confirm Password</label>
                            <input type="password" value={passwordForm.data.password_confirmation} onChange={e => passwordForm.setData('password_confirmation', e.target.value)} required />
                        </div>

                        <div className="flex items-center gap-4">
                            <button type="submit" disabled={passwordForm.processing} className={styles['btn-save']}>Save Password</button>
                            {passwordForm.recentlySuccessful && <span className={styles['success-msg']}>Saved.</span>}
                        </div>
                    </form>
                </section>
            </div>

            <div className={styles['right-col']}>
                {stats ? (
                    <div className={`${styles['threat-banner']} ${bannerClass}`}>
                        <div className={styles['threat-banner__content']}>
                            <span className={styles['threat-banner__label']}>Local Security Status:</span>
                            <strong className={styles['threat-banner__value']}>{stats.threatLevel}</strong>
                        </div>
                        <p className={styles['threat-banner__desc']}>
                            {stats.recent} incidents near your home ({stats.radius}km) in the last 48h.
                        </p>
                    </div>
                ) : (
                    <div className={styles['status-placeholder']}>
                        Set your home location to see local security alerts.
                    </div>
                )}

                <section className={styles['section']}>
                    <div className={styles['section__header']}>
                        <h3>Your Logs</h3>
                        <p>An overview of all the suspicious activities you have reported.</p>
                    </div>

                    <div className={styles['mini-map-container']}>
                        <MapContainer
                            center={[50.842207, 4.322723]}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {sightings.map(sighting => (
                                <Marker key={sighting.id} position={[sighting.latitude, sighting.longitude]}>
                                    <Popup>{sighting.short_description}</Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    <ul className={styles['log-list']}>
                        {sightings.length === 0 ? (
                            <li><span className={styles['log-date']}>You haven't logged any sightings yet.</span></li>
                        ) : (
                            sightings.map(s => (
                                <li key={s.id}>
                                    <div>
                                        <div className={styles['log-type']}>
                                            {s.type === 'person' ? 'Person' : 'Object'}
                                        </div>
                                        <div style={{ fontSize: '0.875rem' }}>{s.short_description}</div>
                                    </div>
                                    <span className={styles['log-date']}>
                                        {new Date(s.created_at).toLocaleDateString('en-GB')}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </section>
            </div>
        </div>
    );
};

Profile.layout = (page: React.ReactNode) => <Layout children={page} />;

export default Profile;