import { FormatConfig, IFormatter } from './formatter';
import { JsonMLNode } from './jsonML';
import { Y } from './y';

const listStyle = { style: 'list-style-type: none; padding: 0; margin: 0 0 0 12px; font-style: normal; position: relative' };
const typeNameStyle = { style: 'color: rgb(232,98,0); position: relative' };
const primaryKeyStyle = { style: 'color: rgb(142, 0, 75); font-weight: 700' };
const previewPrimaryKeyStyle = { style: 'color: rgb(143, 143, 143)' };
const previewValueStyle = { style: 'color: rgb(31, 31, 31)' };
const tagNameStyle = { style: 'color: #881391' };
const secondaryKeyStyle = { style: 'color: rgb(142, 0, 75); opacity: 0.6;' };
const inlineValuesStyle = { style: 'font-style: italic; position: relative' };
const evaluatedStyle = { style: 'color: rgb(142, 0, 75)' };

export default function createFormatters(YModule: Y) {
    function isYMap(o: unknown): o is Y.Map<any> {
        return o instanceof YModule.Map;
    }
    function isYArray(o: unknown): o is Y.Array<any> {
        return o instanceof YModule.Array;
    }
    function isYText(o: unknown): o is Y.Text {
        return o instanceof YModule.Text && !(o instanceof YModule.XmlText);
    }
    function isYXmlFragment(o: unknown): o is Y.XmlFragment {
        return o instanceof YModule.XmlFragment && !(o instanceof YModule.XmlElement);
    }
    function isYXmlElement(o: unknown): o is Y.XmlElement {
        return o instanceof YModule.XmlElement;
    }
    function isYXmlText(o: unknown): o is Y.XmlText {
        return o instanceof YModule.XmlText;
    }

    const reference = (object: any, config?: FormatConfig) => {
        const style = config?.inPreview ? previewValueStyle : {};
        if (typeof object === 'undefined')
            return ['span', style, 'undefined'];
        if (object === 'null')
            return ['span', style, 'null'];

        return ['object', { object, config }];
    };

    const ArrayFormatter: IFormatter<Y.Array<any>> = {
        header(o: unknown, config?) {
            if (!isYArray(o)) return null;
            if (config?.noPreview)
                return ['span', ['span', typeNameStyle, 'Y.Array'], ['span', `(${o.length})`]];

            const preview = o.toArray()
                .reduce((preview, item) => {
                    if (preview.length)
                        preview.push(', ');

                    preview.push(['span', {}, reference(item, { noPreview: true, inPreview: true })]);
                    return preview;
                }, [] as JsonMLNode[]);
            let inlinePreview = ['span', inlineValuesStyle, '[', ...preview, ']'];
            return ['span', {},
                ['span', typeNameStyle, 'Y.Array'],
                ['span', `(${o.length})`],
                ' ', inlinePreview
            ];
        },
        hasBody(o, config?) {
            return o.length > 0 && !(config && config.noPreview);
        },
        body(o) {
            const children = o.map((val, i) => {
                return [
                    'li', {},
                    ['span',
                        primaryKeyStyle,
                        i + ': '
                    ],
                    reference(val)
                ];
            });
            children.push(
                [
                    'li', {},
                    ['span',
                        secondaryKeyStyle,
                        'length: '
                    ],
                    reference(o.length)
                ]
            );
            // if (o.parent) {
            //     children.push([
            //         'li', {},
            //         ['span',
            //             secondaryKeyStyle,
            //             'parent: '
            //         ],
            //         reference(o.parent)
            //     ]);
            // }
            return ['ol', listStyle, ...children];
        }
    };

    const MapFormatter: IFormatter<Y.Map<any>> = {
        header(o, config?) {
            if (!isYMap(o)) return null;
            if (config?.noPreview)
                return ['span', typeNameStyle, 'Y.Map'];

            const preview = Array.from(o.keys())
                .reduce((preview, key) => {
                    if (preview.length)
                        preview.push(', ');

                    preview.push(['span', {},
                        ['span', previewPrimaryKeyStyle, key + ': '],
                        reference(o.get(key), { noPreview: true, inPreview: true })
                    ]);
                    return preview;
                }, [] as JsonMLNode[]);
            let inlinePreview = ['span', inlineValuesStyle, '{', ...preview, '}'];
            return ['span', {},
                ['span', typeNameStyle, 'Y.Map'],
                ' ', inlinePreview
            ];
        },
        hasBody(o, config?) {
            return !(config && config.noPreview);
        },
        body(o) {
            const children = Array.from(o.keys())
                .map(key => {
                    return [
                        'li', {},
                        ['span',
                            primaryKeyStyle,
                            key + ': '
                        ],
                        reference(o.get(key))
                    ];
                });
            // if (o.parent) {
            //     children.push(
            //         [
            //             'li', {},
            //             ['span',
            //                 secondaryKeyStyle,
            //                 'parent: '
            //             ],
            //             reference(o.parent)
            //         ]
            //     );
            // }
            return ['ol', listStyle, ...children];
        }
    };

    const TextFormatter: IFormatter<Y.Text> = {
        header(o: any) {
            if (isYText(o) || isYXmlText(o)) {
                return ['span', {},
                    ['span',
                        typeNameStyle,
                        isYXmlText(o) ? 'Y.XmlText' : 'Y.Text'
                    ],
                    ' ', o.toString()
                ];
            }
            return null;
        },
        hasBody(o): boolean {
            return true;
        },
        body(o) {
            const deltas = o.toDelta();
            const children = [
                [
                    'li',
                    {},
                    ['span',
                        evaluatedStyle,
                        'toDelta(): '
                    ],
                    reference(deltas)
                ]
            ];
            // if (o.parent) {
            //     children.unshift(
            //         [
            //             'li', {},
            //             ['span',
            //                 secondaryKeyStyle,
            //                 'parent: '
            //             ],
            //             reference(o.parent)
            //         ]
            //     );
            // }
            return (
                ['ol',
                    listStyle,
                    ...children
                ]
            );
        }
    };

    const XmlFragmentFormatter: IFormatter<Y.XmlFragment> = {
        header(o,) {
            if (isYXmlFragment(o)) {
                return ['span', ['span', typeNameStyle, 'Y.XmlFragment']];
            }
            if (isYXmlElement(o)) {
                return ['span',
                    ['span', typeNameStyle, 'Y.XmlElement'],
                    ' ',
                    ['span', tagNameStyle, `<${o.nodeName}>`],
                    o.length > 0 ? '{…}' : '',
                    ['span', tagNameStyle, `</${o.nodeName}>`],
                ];
            }
            return null;
        },
        hasBody(o): boolean {
            return true;
        },
        body(o) {
            const children = o.toArray().map((child, i) => {
                return [
                    'li', {},
                    reference(child)
                ];
            });
            return ['ol', listStyle, ...children];
        },
    };

    return {
        ArrayFormatter,
        MapFormatter,
        TextFormatter,
        XmlFragmentFormatter
    };
}
