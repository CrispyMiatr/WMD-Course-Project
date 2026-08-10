import { Link, usePage } from '@inertiajs/react';
import header from '~styles/components/layout/header.module.scss'
import logo from "~assets/logo_b.svg"
import { NavButton } from '~/Components';

export const Header = () => {
    const { url } = usePage();

    const isHomeActive = url === '/';
    const isMapActive = url.startsWith('/map');

    return (
        <>
            <nav className={header['navbar']}>
                <div className={header['navbar__container']}>
                    <p className={header['navbar__title']}>
                        <Link href="/" className={header['logo-link']}>
                            <img src={logo} alt="WatchLog" className={header['logo']} />
                        </Link>

                        <li className={header['links__link-item']}>
                            <NavButton name="Home" link="/" isActive={isHomeActive} />
                        </li>

                        <li className={header['links__link-item']}>
                            <NavButton name="Map" link="/map" isActive={isMapActive} />
                        </li>
                    </p>
                </div>
            </nav>

            <nav className={header['mobile-nav']}>

            </nav>
        </>
    );
};