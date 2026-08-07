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
                    </div>

                    <div className={home['hero__text__subtitle']}>
                        Keep your neighbourhood safe with WatchLog.
                    </div>

                    <div className={home['hero__text__description']}>
                        Log sightings and track people of interest.
                    </div>
                </div>
            </section>
        </div>
    );
};

Home.layout = (page: React.ReactNode) => <Layout children={page} />;

export default Home;