import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
    }
    var route: typeof ziggyRoute;
}

// Necessary for Vite to recognize the env/glob types
interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly glob: any;
}