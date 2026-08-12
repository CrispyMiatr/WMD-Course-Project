import { Head, Link, router } from '@inertiajs/react';
import { Layout } from '~/Components';
import { OverviewPageType } from '~/types';
import styles from '~styles/pages/overview.module.scss';
import { useState } from 'react';

const Overview = ({ sightings, stats, filters }: OverviewPageType) => {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');

    // Handle searching with a small delay (optional) or via button
    const handleFilter = () => {
        router.get(route('overview.index'), { search, type }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <div className={styles['overview-container']}>
            <Head title="Neighborhood Overview" />

            {/* Statistics Section */}
            <div className={styles['stats-grid']}>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-card__value']}>{stats.total}</span>
                    <span className={styles['stat-card__label']}>Total Logs</span>
                </div>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-card__value']}>{stats.people}</span>
                    <span className={styles['stat-card__label']}>People Reported</span>
                </div>
                <div className={styles['stat-card']}>
                    <span className={styles['stat-card__value']}>{stats.objects}</span>
                    <span className={styles['stat-card__label']}>Objects Reported</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={styles['filter-bar']}>
                <input
                    type="text"
                    placeholder="Search descriptions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="person">Person</option>
                    <option value="other">Other</option>
                </select>
                <button onClick={handleFilter} className="nav-button-primary">Apply</button>
            </div>

            {/* Feed Section */}
            <div className={styles['feed']}>
                {sightings.data.length === 0 ? (
                    <p>No sightings found in this neighborhood.</p>
                ) : (
                    sightings.data.map(s => (
                        <div key={s.id} className={`${styles['sighting-card']} ${s.type === 'person' ? styles['sighting-card--person'] : ''}`}>
                            <div className={styles['sighting-card__info']}>
                                <h3>{s.type === 'person' ? 'Person Spotted' : (s.details as any).entity_type}</h3>
                                <p>{s.short_description}</p>
                                <small>
                                    Reported by {s.user?.username || s.user?.name} • {
                                        new Date(s.created_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        }).replace(/\//g, '-')
                                    }
                                </small>
                            </div>
                            <Link href={route('map.index')} className="nav-button">Map</Link>
                        </div>
                    ))
                )}
            </div>

            {/* Simple Pagination */}
            <div className={styles['pagination']}>
                {sightings.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || ''}
                        className={`${styles['page-link']} ${link.active ? styles['page-link--active'] : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
};

Overview.layout = (page: React.ReactNode) => <Layout children={page} />;
export default Overview;