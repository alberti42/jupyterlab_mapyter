import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import CodeMirror from 'codemirror';
import { MATLAB_mode } from './codemirror-matlab';

function download_matlab_fig(btn_item: HTMLElement, fmt: string) {
  let data = "";
  let download = "";
  
  let container = btn_item.nextElementSibling as HTMLElement;
  
  switch(fmt) {
    case 'svg':
      data = "data:image/svg+xml;base64," + 
      btoa(`<?xml version="1.0"?><!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN' 'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>${container.innerHTML}`);
      download = 'matlab_graph.svg';
      break;
    case 'gif':
    case 'png':
    case 'mp4':
      data = (container as HTMLVideoElement).src || "";
      download = `matlab_graph.${fmt}`;
      break;
    case 'mov':
    case 'zip':
      data = (container as HTMLAnchorElement).href || "";
      download = `matlab_graph.${fmt}`;
      break;
  }

  let a = document.createElement('a');
  a.download = download;
  a.href = data;
  a.target = '_blank';

  a.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  }));
}


const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_mapyter:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension jupyterlab_mapyter is activated!');

    MATLAB_mode(CodeMirror);
    (window as any).download_matlab_fig = download_matlab_fig;

    const command: string = 'matlab:open';
    app.commands.addCommand(command, {
      label: 'Test command',
      execute: () => {
        console.log('This is a test command for MATLAB in JupyterLab.');
      }
    });

    palette.addItem({ command, category: 'MATLAB' });
  }
};

export default plugin;
