import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
	ICommandPalette
} from '@jupyterlab/apputils';

import { ICodeMirror } from '@jupyterlab/codemirror';

import { MATLAB_mode } from "./codemirror-matlab";

function download_matlab_fig(btn_item:HTMLElement,fmt:string) {
	let data;
	let download;
	
	let container:Element = btn_item.nextElementSibling;
		
	switch(fmt) {
		case 'svg':
		data = "data:image/svg+xml;base64," + 
		btoa("<?xml version=\"1.0\"?><!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN' " +
			"'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>" + 
			container.innerHTML);
		download = 'matlab_graph.svg';
		break;
		case 'gif':
		case 'png':
		case 'mp4':
		data = (<HTMLVideoElement>container).src;
		download = 'matlab_graph.' + fmt;
		break;
		case 'mov':
		case 'zip':
		data = (<HTMLAnchorElement>container).href;
		download = 'matlab_graph.' + fmt;
		break;
	}

	let a = document.createElement('a');
	a.download = download;
	a.href = data;
	a.target = '_blank';

	let evt = new MouseEvent('click', {
		view: window,
		bubbles: false,
		cancelable: true
	});

	a.dispatchEvent(evt);
}

function register_MATLAB_CodeMirror(code_mirror_singleton:ICodeMirror)
{
  (code_mirror_singleton as any).defineMode("matlab",MATLAB_mode,"matlab");

  (code_mirror_singleton as any).defineMIME("text/x-matlab", "matlab");

  let mathematica_idx:number = (code_mirror_singleton as any).modeInfo.findIndex((el:any) => (el as any).name=="Mathematica");

  if (mathematica_idx > -1) {
    let ext:Array<string> = (code_mirror_singleton as any).modeInfo[mathematica_idx].ext;

    let m_idx:number = ext.findIndex(el => el == "m");

    if (m_idx > -1) {
      ext.splice(m_idx, 1);
    }

    (code_mirror_singleton as any).modeInfo[mathematica_idx].ext = ext
  }

  (code_mirror_singleton as any).modeInfo.push({
    name: "MATLAB",
    mime: "text/x-matlab",
    mode: "matlab",
    ext: ["m"]    
  });
}

function activate(
	app: JupyterFrontEnd,
	palette: ICommandPalette,
	code_mirror: ICodeMirror
	) {
	// Add an application command

	register_MATLAB_CodeMirror(code_mirror.CodeMirror);

	(window as any).download_matlab_fig = download_matlab_fig;

	const command: string = 'matlab:open';
	app.commands.addCommand(command, {
		label: 'Test command',
		execute: () => {
      console.log('This is a test.');
		}
	});

	// Add the command to the palette.
	palette.addItem({command, category: 'MATLAB'});

  // console.log('JupyterLab extension jupyterlab_matlab is activated!');
}


/**
 * Initialization data for the jupyterlab_matlab extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
	id: 'jupyterlab_mapyter',
	autoStart: true,
	requires: [ICommandPalette,ICodeMirror],
	activate: activate
};

export default extension;

