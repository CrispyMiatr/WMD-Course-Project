import { UserType } from "./user.types";

export interface SightingFormType {
    lat: number;
    lng: number;
    recentTracks: SightingType[];
    onSuccess: () => void;
}

// Person base
export interface PersonDetailsType {
    hair_color: string;
    headwear?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    height: 'short' | 'middle' | 'tall' | '';
}

// Other base
export interface OtherDetailsType {
    entity_type: string;
    general_color: string;
    accent_colors?: string;
}

// Sighting base
export type PersonMicrolabel = 'suspicious_person' | 'loitering_youth' | 'trespassing';
export type ObjectMicrolabel = 'suspicious_vehicle' | 'vandalism' | 'theft_risk' | 'other';
export type SightingMicrolabel = PersonMicrolabel | ObjectMicrolabel;

export interface BaseSightingType {
    id: number;
    user_id: number;
    latitude: number;
    longitude: number;
    location_name: string | null;
    short_description: string;
    track_id: string | null;
    created_at: string;
    user?: UserType;
}

// 2. Link specific Microlabels to specific Detail types
export interface PersonSightingType extends BaseSightingType {
    type: PersonMicrolabel;
    details: PersonDetailsType;
}

export interface OtherSightingType extends BaseSightingType {
    type: ObjectMicrolabel;
    details: OtherDetailsType;
}

export type SightingType = PersonSightingType | OtherSightingType;

export const PERSON_MICROLABELS: PersonMicrolabel[] = [
    'suspicious_person',
    'loitering_youth',
    'trespassing'
];

export const isPersonSighting = (sighting: SightingType): sighting is PersonSightingType => {
    return PERSON_MICROLABELS.includes(sighting.type as PersonMicrolabel);
};