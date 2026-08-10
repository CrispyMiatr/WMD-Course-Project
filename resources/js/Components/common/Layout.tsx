import { PropsWithChildren } from 'react';
import { Footer, Header } from '~/Components';

interface LayoutProps extends PropsWithChildren {
    hideFooter?: boolean;
}

export const Layout = ({ children, hideFooter = false }: LayoutProps) => {
    return (
        <div className='container-wrapper'>
            <Header />
            <main>{children}</main>
            {!hideFooter && <Footer />}
        </div>
    );
}