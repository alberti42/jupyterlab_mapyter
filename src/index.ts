import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { downloadFiguresPlugin } from './download_figures_plugin';

const plugins: JupyterFrontEndPlugin<any>[] = [downloadFiguresPlugin];

export default plugins;
