import createFormatters from './createFormatters';
import { Y } from './y';

let installed = false;
function install(YModule: Y) {
    if (installed) {
        return;
    }

    //@ts-ignore
    const devtoolsFormatters = window.devtoolsFormatters = window.devtoolsFormatters || [];

    const {
        MapFormatter,
        ArrayFormatter,
        TextFormatter,
        XmlFragmentFormatter,
    } = createFormatters(YModule);

    devtoolsFormatters.push(
        MapFormatter,
        ArrayFormatter,
        TextFormatter,
        XmlFragmentFormatter,
    );

    installed = true;
}

export default install;
