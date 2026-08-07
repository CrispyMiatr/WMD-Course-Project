import header from '~styles/components/layout/header.module.scss'

export const Header = () => {

    return (
        <>
            <nav className={header['navbar']}>
                <div className={header['navbar__container']}>
                    <p className={header['navbar__title']}>
                        Header
                    </p>
                </div>
            </nav>

            <nav className={header['mobile-nav']}>

            </nav>
        </>
    );
};