import { Link, usePage } from '@inertiajs/react';
import header from '~styles/components/layout/header.module.scss';

export const Header = () => {
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <header className={header['header-wrapper']}>
            <nav className={header['navbar']}>
                <div className={header['navbar__container']}>

                    <div className={header['navbar__left']}>
                        <Link href={route('home')} className={header['navbar__logo-link']}>
                            {/* <img src={logo} alt="WatchLog" className={header['navbar__logo']} /> */}
                            WatchLog
                        </Link>

                        <div className={header['navbar__links']}>
                            <Link
                                href={route('home')}
                                className={`${header['nav-link']} ${route().current('home') ? header['active'] : ''}`}
                            >
                                Home
                            </Link>
                            <Link
                                href={route('map.index')}
                                className={`${header['nav-link']} ${route().current('map.index') ? header['active'] : ''}`}
                            >
                                Map
                            </Link>
                            {/* TODO: general overview page */}
                        </div>
                    </div>

                    <div className={header['navbar__right']}>
                        {user ? (
                            <>
                                <Link
                                    href={route('profile.edit')}
                                    className={`${header['nav-link']} ${route().current('profile.edit') ? header['active'] : ''}`}
                                >
                                    {user.username || user.name}
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    type="button"
                                    className={header['nav-button-logout']}
                                >
                                    Log Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className={header['nav-link']}>
                                    Log in
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};