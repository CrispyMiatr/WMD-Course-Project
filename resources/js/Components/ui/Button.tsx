import { Link, usePage } from '@inertiajs/react';
import type { ButtonType } from '~/types/button.types';
import '~styles/app.scss'

export const NavButton = ({ name, link, isActive }: ButtonType) => {

    return (
        <Link
            href={link}
            className={`nav-button ${isActive ? 'nav-button--active' : ''}`}
        >
            <p className='nav-button__title'>{name}</p>
        </Link>
    );
};