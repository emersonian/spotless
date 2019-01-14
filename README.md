# Spotless: Modern dev workflow for Spotfire scripts

This is a prototype.

It currently supports:

- Loading Javascript code from a server outside of Spotfire (see DXP javascript "spotlessLoader")

- Calling IronPython scripts from Javascript with or without parameters

```
spotless.callPython('userScript1', {testParam: 'I am a param passed from Javascript.'})
```

- Setting Document Properties from Javscript

```
spotless.setDocProp('spotlessDebug', 'Page2 set this')
spotless.setDocProps({
  spotlessDebug: 'prop1 ' + spotless.randStr(),
  spotlessDebug2: 'prop2 ' + spotless.randStr()
})
```

- Showing a Python MessageBox for debug purposes ("it's working!")

```
spotless.messageBox("Hello world from Javascript-to-Python.")
```

## Trying Spotless

1. Launch the spotless dev server:

```
npm install
npm start
```

2. Open  ```examples/Starter.dxp```

3. Code is currently only loaded from ```js/spotless-dev.js```. To try spotless, edit this file and save your changes. When you switch tabs in Spotfire, all javascript code is reloaded from ```spotless-dev.js```

4. Use the Spotfire development console. Try running a Spotless command to get a feel for things.

```
spotless.messageBox("hello world")
```

## Goals

Bring sanity and peace to Earth.

- One file: JS source builds into a single JS file which can be hosted on CDN rather than staticly inside a DXP (webpack)
- Source maps to ease debugging in Spotfire/chromium's dev console
- Hot reloading: Spotfire browser reloads upon code change detected.
- Bring your own IDE: liberate developers from Spotfire's JS code editor
- Developer collaboration: Pull both JS and Python scripts out of DXP to enable git version control
- SASS and CSS building, also to optionally be hosted on CDN rather than staticly inside of DXP
- Unified error reporting between Python and JS (capture Python exceptions and print(), display in dev console)
- Call Python scripts from Javascript
- Call Javascript from Python
- Blocking calls: wait or callback once Python script completes
- Returning values from Python scripts to Javascript callback function
- Bind Javascript variables to document properties

## Notes

Useful for debugging Spotfire IronPython exceptions and print statements: (set debug level to Trace in Help menu)

```
tail -f Spotfire.Dxp.SupportDiagnostics.log | grep -E "spotlessProxy|IronPython"
```
