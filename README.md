# PlanQuit

This is a Chrome extension for a final project in CS 565 at UIUC.

## Get started

Clone this repository, and then, in the root directory:

1. `npm install`
2. `npm start`

The unpacked Chrome extension will be compiled into `dist/`. You can load it into Chrome by enabling developer mode on
the "Extensions" page, hitting "Load unpacked", and selecting the `dist/` folder. You can pack the extension into a
`.crx` by using the "Pack extension" button on the same page.

## Source layout

There are six different UI screens for PlanQuit, which are the html files in the `dist/` folder.  The corresponding
`.ts` files for the UIs are located in `src/ui` folder.

* `dist/popup.html`: The interface that pops up when clicking on the extension button in the toolbar.  This has no
script associated with it.
* `dist/blacklist.html`: The site blacklist editor
* `dist/planEditor.html`: The interface where the user puts in their plan to use blacklist sites less.
* `dist/configScreen.html`: Config for when to actively block sites
* `dist/progressPane.html`: Interface that displays the logged browsing behavior of the user
* `dist/blockPage.html`: The screen that appears when visiting a website that is on the blacklist during active
discouragement.

### Other source files
* `src/app/background.ts`: Sets up website blocking and tracking
* `src/app/blockEffectiveness.ts`: Functions for logging user interactions with the block screen
* `src/app/Blocker.ts`: Actually does the website blocking
* `src/app/blockTimes.ts`: Functions for getting and setting website blocking times
* `src/app/OpenInterval.ts`: Helper class.  See docs in file.
* `src/app/QuitPlan.ts`: Functions for getting and setting user plan
* `src/app/siteBlacklist.ts`: Functions for getting and setting website blacklist
* `src/app/SiteLog.ts`: Logs site visits and duration
* `src/app/Tracker/ts`: Notifies SiteLog when the user visits a new site.
