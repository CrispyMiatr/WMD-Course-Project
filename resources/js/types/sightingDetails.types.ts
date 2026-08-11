import { SightingType } from "./sightingForm.types";

export interface SightingDetailsType {
    sighting: SightingType;
    onClose: () => void;
}