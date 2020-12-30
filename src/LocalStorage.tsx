import { stringify } from "querystring";

export enum BooleanStorage {
    TRUE = 'true',
    FALSE = 'false'
}

export const INITIAL_LOCAL_STORAGE: LocalStorage = {
    showTagNames: BooleanStorage.TRUE,
    showIds: BooleanStorage.TRUE,
    showClasses: BooleanStorage.TRUE,
    showOther: BooleanStorage.TRUE,
    otherFilters: '',
};

// local storage always has string values for it's keys AND values
export type LocalStorage = {
    showTagNames: BooleanStorage,
    showIds: BooleanStorage,
    showClasses: BooleanStorage,
    showOther: BooleanStorage,
    otherFilters: string,
};

/**
 * Meant to be called one time on startup
 */
export function resetLocalStorage(localStorage: LocalStorage) {
    const ls = window.localStorage;
    ls.clear();
    Object.entries(localStorage).forEach(([key, value]) => ls.setItem(key, value));
}
