import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(aurelia: FrameworkConfiguration) {
    aurelia.globalResources([
        PLATFORM.moduleName('./aurelia-dragscroll')
    ]);
}
