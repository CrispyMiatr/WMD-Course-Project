import { Link } from '@inertiajs/react';
import { Layout } from '~/Components/common/Layout';
import home from '~styles/pages/home.module.scss'
import logo from "~assets/logo_b.svg"

const Home = () => {
    return (
        <div className={home['home-container']}>
            <section className={home['hero']} id='hero'>
                <div className={home['hero__text']}>
                    <div className={home['hero__text__title']}>
                        <img src={logo} alt="Watchlog" className={home['logo']} />
                        <h1 className={home['title']}>WatchLog</h1>
                    </div>

                    <div className={home['hero__text__subtitle']}>
                        Keep your neighbourhood safe with WatchLog.
                    </div>

                    <div className={home['hero__text__description']}>
                        Log sightings, track movements, and stay informed about suspicious activity in your area.
                    </div>

                    <div className={home['hero__cta']}>
                        <Link href={route('map.index')} className={home['btn-primary']}>
                            Open Map
                        </Link>
                        <Link href={route('overview.index')} className={home['btn-secondary']}>
                            View Overview
                        </Link>
                    </div>
                </div>
            </section>

            <section className={home['features']}>
                <div className={home['feature-card']}>
                    <h2>Interactive Surveillance</h2>
                    <p>Pin suspicious sightings on a real-time map and provide detailed descriptions to alert your neighbors.</p>
                    <Link href={route('map.index')} className={home['card-link']}>Go to Map &rarr;</Link>
                </div>

                <div className={home['feature-card']}>
                    <h2>Community Insights</h2>
                    <p>Analyze neighborhood trends, check local threat levels, and follow movement trajectories of reported subjects.</p>
                    <Link href={route('overview.index')} className={home['card-link']}>View Feed &rarr;</Link>
                </div>
            </section>
        </div>
    );
};

Home.layout = (page: React.ReactNode) => <Layout children={page} />;

export default Home;