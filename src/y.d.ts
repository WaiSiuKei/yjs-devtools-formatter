import type { Map, Array, Text, XmlFragment, XmlElement, XmlText } from 'yjs';

export interface Type<T> extends Function {new(...args: any[]): T;}

export interface Y {
    Map: Type<Map<any>>,
    Array: Type<Array<any>>,
    Text: Type<Text>,
    XmlFragment: Type<XmlFragment>,
    XmlElement: Type<XmlElement>,
    XmlText: Type<XmlText>,
}
export namespace Y {
    export type { Array, Map, Text, XmlFragment, XmlElement, XmlText } from 'yjs';
}
