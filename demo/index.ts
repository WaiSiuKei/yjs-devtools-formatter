import * as Y from 'yjs';
import install from '../src/index';

const ydoc = new Y.Doc();
const ymap = ydoc.getMap('my map type');
const ymapNested = new Y.Map<any>();
ymap.set('a', 'value');
ymap.set('b', ymapNested);
ymapNested.set('c', 2);

const yarray = ydoc.getArray('my array type');
const yarrayNested = new Y.Array<any>();

let item1 = new Y.Map();
item1.set('id', 1);
let item2 = new Y.Map();
item2.set('id', 2);
yarrayNested.push([item1, item2]);
yarray.insert(0, [yarrayNested]);
yarray.insert(0, [1, 2, 3]); // insert three elements

const ytext = ydoc.getText('my text type');
ytext.insert(0, 'abc'); // insert three elements
ytext.format(1, 2, { bold: true }); // delete second element

const yxmlFragment = ydoc.getXmlFragment('my xml fragment');

const yxmlText1 = new Y.XmlText();
yxmlFragment.insert(0, [yxmlText1]);
yxmlText1.insert(0, 'abc1');

const yxmlElement = new Y.XmlElement('node-name');
yxmlFragment.insertAfter(yxmlText1, [yxmlElement]);

const yxmlText2 = new Y.XmlText();
yxmlElement.insert(0, [yxmlText2]);
yxmlText2.insert(0, 'abc1');

console.clear();
console.log(ymap);
console.log(yarray);
console.log(ytext);
console.log(yxmlFragment);
install(Y);
console.log(ymap);
console.log(yarray);
console.log(ytext);
console.log(yxmlFragment);
