import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Layout } from '~/Components';
import type { ProfilePageType } from '~/types';
import styles from '~styles/pages/profile.module.scss';
import 'leaflet/dist/leaflet.css';

const Profile = ({ auth, status, sightings }: ProfilePageType) => {
    const user = auth.user;

    // Profile info
    const profileForm = useForm({
        name: user.name,
        username: user.username || '',
        email: user.email,
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

    return (
        <div className={styles['profile-container']}>
            <Head title="Profile" />

            <div className={styles['left-col']}>
                <section className={styles['section']}>
                    <div className={styles['section__header']}>
                        <h2>Profile Information</h2>
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
                        <h2>Update Password</h2>
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
                <section className={styles['section']}>
                    <div className={styles['section__header']}>
                        <h2>Your Logs</h2>
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