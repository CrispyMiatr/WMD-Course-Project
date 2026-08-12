export interface SightingFormType {
    lat: number;
    lng: number;
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
export interface BaseSightingType {
    id: number;
    user_id: number;
    latitude: number;
    longitude: number;
    location_name: string | null;
    short_description: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        username: string | null;
    };
}

// Person
export interface PersonSightingType extends BaseSightingType {
    type: 'person';
    details: PersonDetailsType;
}

// Other
export interface OtherSightingType extends BaseSightingType {
    type: 'other';
    details: OtherDetailsType;
}

// Sighting
export type SightingType = PersonSightingType | OtherSightingType;