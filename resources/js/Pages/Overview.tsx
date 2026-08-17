import { Head, Link, router } from '@inertiajs/react';
import { Layout } from '~/Components';
import { isPersonSighting, OverviewPageType } from '~/types';
import styles from '~styles/pages/overview.module.scss';
import { useState } from 'react';

const Overview = ({ sightings, stats, filters, insights }: OverviewPageType) => {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');

    const handleFilter = () => {
        router.get(route('overview.index'),
            {
                search: search || undefined, // Send undefined if empty to keep URL clean
                type: type !== 'all' ? type : undefined
            },
            {
                preserveState: true,
                replace: true
            }
        );
    };

    const bannerClass = stats.uiTheme ? styles[`threat-banner--${stats.uiTheme}`] : '';

    return (
        <div className={styles['overview-container']}>
            <Head title="Neighborhood Overview" />

            <div className={`${styles['threat-banner']} ${bannerClass}`}>
                <div className={styles['threat-banner__content']}>
                    <span className={styles['threat-banner__label']}>Neighborhood Security Status:</span>
                    <strong className={styles['threat-banner__value']}>{stats.threatLevel}</strong>
                </div>
                <p className={styles['threat-banner__desc']}>
                    {stats.recent} incidents reported in the last 48 hours.
                    {stats.threatLevel === 'Critical' ? ' Exercise extreme caution.' : ' Stay vigilant.'}
                </p>
            </div>

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

            {Object.keys(insights).length > 0 && (
                <section className={styles['insights-section']}>
                    <h2 className={styles['section-title']}>Community Watch Patterns</h2>
                    <div className={styles['insights-grid']}>
                        {Object.entries(insights).map(([ageGroup, patterns]) => (
                            <div key={ageGroup} className={styles['insight-card']}>
                                <div className={styles['insight-card__header']}>
                                    <span className={styles['insight-age-label']}>Demographic: {ageGroup}</span>
                                </div>
                                <div className={styles['insight-card__body']}>
                                    <p>Primary Concern:</p>
                                    <strong>{patterns[0].type.replace('_', ' ').toUpperCase()}</strong>
                                    <small>{patterns[0].count} recent logs</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className={styles['filter-bar']}>
                <input
                    type="text"
                    placeholder="Search descriptions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="all">All Logs</option>
                    <optgroup label="General Categories">
                        <option value="person">All People</option>
                        <option value="other">All Objects</option>
                    </optgroup>
                    <optgroup label="Specific Microlabels">
                        <option value="suspicious_person">Suspicious Person</option>
                        <option value="loitering_youth">Loitering Youth</option>
                        <option value="trespassing">Trespassing</option>
                        <option value="suspicious_vehicle">Suspicious Vehicle</option>
                        <option value="vandalism">Vandalism</option>
                        <option value="theft_risk">Theft Risk</option>
                    </optgroup>
                </select>
                <button onClick={handleFilter} className="nav-button-primary">Apply</button>
            </div>

            <div className={styles['feed']}>
                {sightings.data.length === 0 ? (
                    <p>No sightings found in this neighborhood.</p>
                ) : (
                    sightings.data.map(s => {
                        const isPerson = isPersonSighting(s);

                        return (
                            <div key={s.id} className={`${styles['sighting-card']} ${isPerson ? styles['sighting-card--person'] : ''}`}>
                                <div className={styles['sighting-card__info']}>
                                    <div className={styles['sighting-card__badge-row']}>
                                        <h3>
                                            {isPerson
                                                ? 'Person'
                                                : (s as any).details.entity_type || 'Object'}
                                        </h3>
                                        <span className={styles['microlabel-tag']}>
                                            {s.type.replace('_', ' ')}
                                        </span>
                                        <span className={styles['location-badge']}>{s.location_name || 'Area Unknown'}</span>
                                    </div>
                                    <p>{s.short_description}</p>
                                    <small className={styles['reporter-info']}>
                                        Reported by {s.user?.username || s.user?.name}

                                        {s.user?.rank && (
                                            <span className={`${styles['rank-badge']} ${styles[`rank-badge--${s.user.rank.level}`]}`}>
                                                {s.user.rank.label}
                                            </span>
                                        )}

                                        <span className={styles['report-date']}>
                                            • {new Date(s.created_at).toLocaleDateString('en-GB')}
                                        </span>
                                    </small>
                                </div>
                                <Link href={route('map.index')} className="nav-button">Map</Link>
                            </div>
                        )
                    })
                )}
            </div>

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