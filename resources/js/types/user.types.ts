export interface UserType {
    id: number;
    name: string;
    username: string | null;
    email: string;
    home_latitude?: number | null;
    home_longitude?: number | null;
    radius_km?: number;
}