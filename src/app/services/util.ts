export interface IPageResult<T> {
    readonly count: number;
    readonly previous: string | null;
    readonly next: string | null;
    readonly results: Array<T>;
}
