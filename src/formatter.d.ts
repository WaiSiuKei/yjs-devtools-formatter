import { JsonMLNode } from './jsonML';

export interface FormatConfig {
    noPreview?: boolean;
    inPreview?: boolean;
}

interface IFormatter<T> {
    header(o: T | any, config?: FormatConfig): null | JsonMLNode;
    hasBody?(o: T, config?: FormatConfig): boolean;
    body?(o: T, config?: FormatConfig): JsonMLNode;
}
