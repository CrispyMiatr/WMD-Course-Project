import footer from '~styles/components/layout/footer.module.scss'

export const Footer = () => {

    return (
        <footer className={footer['footer']}>
            <div className={footer['footer__container']}>
                <p className={footer['footer__title']}>
                    Footer
                </p>
            </div>
        </footer>
    );
};