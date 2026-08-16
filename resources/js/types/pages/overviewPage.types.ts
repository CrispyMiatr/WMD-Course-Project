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
        radius: number;
    };
    filters: {
        search?: string;
        type?: string;
    };
    insights: Record<string, Array<{
        type: string;
        count: number;
    }>>;
}