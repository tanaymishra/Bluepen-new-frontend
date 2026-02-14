export interface handleNextPageTypes {
    pageNumber: number;
    totalPages: number;
}

export interface handlePreviousPageTypes {
    pageNumber: number;
}

export interface SearchHandlerParams {
    value: string;
    callback: () => void;
}

