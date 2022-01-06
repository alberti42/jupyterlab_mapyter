import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_mapyter extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_mapyter:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_mapyter is activated!');
  }
};

export default plugin;
