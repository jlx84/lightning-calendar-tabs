# Lightning calendar tabs

A small addon for Lightning calendar (Mozilla Thunderbird addon) which
adds tabs for easy switching between months/weeks/days.

All views of calendar are supported. Color of tab texts can be adjusted.

More info: [Link to Mozilla plugin site](https://addons.mozilla.org/thunderbird/addon/lightning-calendar-tabs/)

## Plugin development note

To load this plugin into Thunderbird for development make a text file in
`extensions` folder of your profile named `lightningcalendartabs@jlx.84`
(same as `<em:id>` tag from install.rdf) with absolute path to extension.

Start thunderbird with command `thunderbird -P devel` (devel is name of
your development profile).

## "Building" the plugin

Compress `chrome` and `defaults` folder along with `chrome.manifest`, `manifest.json`,
`install.rdf` and `licence.txt` files using zip. Rename the zip file to *.xpi.
Install locally using Thunderbird addon manager.
