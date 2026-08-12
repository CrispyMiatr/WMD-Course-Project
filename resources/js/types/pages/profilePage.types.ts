import { SightingType } from "../sightingForm.types";
import { UserType } from "../user.types";

export interface ProfilePageType {
    auth: {
        user: UserType;
    };
    mustVerifyEmail: boolean;
    status?: string;
    sightings: SightingType[];
}