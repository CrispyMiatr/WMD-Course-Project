import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import ReactDOMServer from 'react-dom/server';
import { route } from '../../vendor/tightenco/ziggy';

import '../css/main.scss';

const appName = import.meta.env.VITE_APP_NAME || 'WMD';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    ...(page.props as any).ziggy,
                    location: new URL((page.props as any).ziggy.location),
                });
            /* eslint-enable */

            return (
                <StrictMode>
                    <App {...props} />
                </StrictMode>
            );
        },
    }),
);
