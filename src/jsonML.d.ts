export type TagName = 'div' | 'span' | 'ol' | 'li' | 'table' | 'tr' | 'td' | 'object';

export type JsonMLNode = any[] | ', ' | ' '
// | [TagName]
// | [TagName, { style: string }]
// | [TagName, { style: string }, string]
// | [TagName, string]
// | [TagName, JsonMLNode, JsonMLNode]
