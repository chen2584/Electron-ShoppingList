const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function() {
    //Create new window
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: "file:",
        slashes: true
    }));
    // Quit App When Closed
    mainWindow.on('closed', function() {
        app.quit();
    });
    

    //Build Menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle Create Add Windows
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'

    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: "file:",
        slashes: true
    }));

    //Garbage Collection Handle
    addWindow.on('closed', function() {
        addWindow = null;
    });

}

// Catch item:add
ipcMain.on('item:add', function(e, item) {
    console.log(item);
    mainWindow.webContents.send('item:add', item); //ส่งต่อไปยัง mainWindow.html ไปรับเอา
    addWindow.close();
});

//Create Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Item',
            },
            {
                label: 'Quit',
                accelerator: 'Alt+CmdOrCtrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }

];

if(process.platform === 'darwin') { //core macOS
    mainMenuTemplate.unshift({
        label: app.getName(),
        submenu: [
          {role: 'about'},
          {type: 'separator'},
          {role: 'services', submenu: []},
          {type: 'separator'},
          {role: 'hide'},
          {role: 'hideothers'},
          {role: 'unhide'},
          {type: 'separator'},
          {role: 'quit'}
        ]
    });
}

// Add Dev Tools Item if not production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'CmdOrCtrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}