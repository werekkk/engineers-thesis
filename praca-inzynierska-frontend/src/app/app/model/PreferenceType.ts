export enum PreferenceType {
    WILLING = 'WILLING',
    AVAILABLE = 'AVAILABLE',
    UNWILLING = 'UNWILLING',
    UNAVAILABLE = 'UNAVAILABLE'
}

export namespace PreferenceType {

    export const DEFAULT = PreferenceType.AVAILABLE

    export function toColor(type: PreferenceType): string { 
        switch(type) {
            case PreferenceType.WILLING:
                return '#89c97b'
            case PreferenceType.AVAILABLE:
                return '#cbfcc0'
            case PreferenceType.UNWILLING:
                return '#ebd071'
            case PreferenceType.UNAVAILABLE:
                return '#fa6e6e'
            default:
                return '#ffffff'
        }
    }

}