export interface CopyConfig {
    clearEmptyDir?: boolean;
    ignore?: string[];
}
export declare function copy(fromPath: string, toPath: string, config?: CopyConfig): void;


// 1