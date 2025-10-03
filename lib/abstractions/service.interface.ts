export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface IBaseService<T extends BaseEntity, TCreate = Omit<T, keyof BaseEntity>, TUpdate = Partial<T>> {
    getAll(): Promise<T[]>;

    getById(id: string): Promise<T>;

    create(entity: TCreate): Promise<T>;

    update(id: string, entity: TUpdate): Promise<T>;

    delete(id: string): Promise<void>;
}

export interface IApiClient {
    get<T>(endpoint: string): Promise<T>;

    post<T>(endpoint: string, data: any): Promise<T>;

    put<T>(endpoint: string, data: any): Promise<T>;

    delete(endpoint: string): Promise<void>;

    setToken(token: string): void;
}
