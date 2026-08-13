import { SightingType } from "../sightingForm.types";

export interface MapPageType {
    status?: string;
    sightings: SightingType[];
    recentTracks: SightingType[];
}