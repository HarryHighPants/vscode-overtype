# Changelog

Notable and interesting changes will go in this file whenever a new release goes out. Boring changes will probably go in here too. Really, all changes are welcome.

## 0.5.0
- New refreshed icon
- Changed activation event to "onStartupFinished"

## 0.4.8
- Added `overtype.isToggledOn` context property, which can be used with `when` in user-defined `keybindings.json`

## 0.4.7
- Downgraded to support vscode engine 1.55.0
- Added ESlint inplace of TSlint
- Changed depricatted "isWatching" to "isBackground"

## 0.4.0

- Replaced configuration `overtype.abbreviatedStatus` by freely adjustable texts `overtype.labelInsertMode` and `overtype.labelOvertypeMode` [#9](https://github.com/DrMerfy/vscode-overtype/issues/9),
  which allows free abbreviation, localization and also allows hiding the current state in the status bar [#4](https://github.com/DrMerfy/vscode-overtype/issues/4).
- The item in the status bar can now be clicked to toggle the insert mode [#3](https://github.com/DrMerfy/vscode-overtype/issues/3).

## 0.3.1

- open-vsx ready, now also found at https://open-vsx.org/extension/DrMerfy/overtype

## 0.3.0

- Continuation fork of the project.
- New configuration `overtype.secondaryCursorStyle`, to change the overtype cursor style.

## 0.2.0

- Fixed an issue where the status indicator/cursor wouldn't be correct when Visual Studio Code opens a window with editors already open.
- Added an animated GIF to the README! (There will be more of these in the future.)

## 0.1.1

Fixed the README. I promise to pay more attention next time.

## 0.1.0

Initial release of `vscode-overtype`. I take no responsibility if it formats your hard drive or punches you in the nose. (But if it does, please open an issue.)
