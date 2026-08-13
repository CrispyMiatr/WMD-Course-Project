import { SightingType } from "../sightingForm.types";

export interface OverviewPageType {
    auth: { user: any };
    sightings: {
        data: SightingType[];
        links: any[]; // Laravel pagination links
        current_page: number;
        last_page: number;
    };
    stats: {
        total: number;
        people: number;
        objects: number;
        recent: number;
        threatLevel: string;
        uiTheme: string;
    };
    filters: {
        search?: string;
        type?: string;
    };
}