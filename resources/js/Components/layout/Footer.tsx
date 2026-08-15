import { Link } from '@inertiajs/react';
import footer from '~styles/components/layout/footer.module.scss';
import logo from '~assets/logo.svg'

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={footer['footer']}>
            <div className={footer['footer__container']}>

                <div className={footer['footer__left']}>
                    <Link href={route('home')} className={footer['footer__logo-link']}>
                        <img src={logo} alt="WatchLog logo" className={footer['navbar__logo']} />
                        <h3>WatchLog</h3>
                    </Link>
                    <p className={footer['footer__text']}>
                        © {currentYear} Neighborhood Surveillance System.
                    </p>
                </div>

                <nav className={footer['footer__nav']}>
                    <Link
                        href={route('home')}
                        className={`${footer['nav-link']} ${route().current('home') ? footer['active'] : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        href={route('map.index')}
                        className={`${footer['nav-link']} ${route().current('map.index') ? footer['active'] : ''}`}
                    >
                        Map
                    </Link>
                    <Link
                        href={route('overview.index')}
                        className={`${footer['nav-link']} ${route().current('overview.index') ? footer['active'] : ''}`}
                    >
                        Overview
                    </Link>
                    <Link
                        href={route('profile.edit')}
                        className={`${footer['nav-link']} ${route().current('profile.edit') ? footer['active'] : ''}`}
                    >
                        Profile
                    </Link>
                </nav>

            </div>
        </footer>
    );
};

