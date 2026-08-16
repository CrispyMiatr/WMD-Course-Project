export interface UserRankType {
    label: string;
    level: 'expert' | 'intermediate' | 'newbie' | 'inactive';
    color: string;
}

export interface UserType {
    id: number;
    name: string;
    username: string | null;
    email: string;
    birth_year: number;
    home_latitude?: number | null;
    home_longitude?: number | null;
    radius_km?: number;
    rank: UserRankType;
}