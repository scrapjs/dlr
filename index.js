'use strict';
const rack = require('./rack')
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow)
		mainWindow = createMainWindow()
});

app.on('ready', () => mainWindow = createMainWindow() );

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 100
	});
	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);
	return win;
}

var sub = require('nanomsg').socket('sub')
var pub = require('nanomsg').socket('pub')
pub.bind('tcp://127.0.0.1:5006')
sub.bind('tcp://127.0.0.1:5005')
sub.on('data', function(data){
	rack(data+'', function(str){
		pub.send('done')
		setTimeout(()=> require('fs').unlink(str+''), 1000)
	})
})