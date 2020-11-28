# CSS to JSS

[![npm version](https://badge.fury.io/js/%40bbon%2Fcss-to-jss.svg)](https://www.npmjs.com/package/@bbon/css-to-jss)

Makr JSS file from CSS file in your project.

## Installation

```bash
$ npm i --save-dev @bbon/css-to-jss
```

or

```bash
$ yarn add --save-dev @bbon/css-to-jss
```

## Specification

```bash
$ css-to-jss help
Usage: css-to-jss [options] [command]

Make JSS React Component from CSS files.

Options:
  -v, --version                      Display version

Commands:
  list [options] <source> [prefix]   Check the list of files to be processing.
  write [options] <source> [prefix]  Make JSS component file from CSS file.
  help                               Display help for css-to-jss
```

### list command

Check the list of files to be processed.

```bash
Usage: css-to-jss list [options] <source> [prefix]

Check the list of files to be processing.

Options:
  -f, --force       Overwrite file
  -t, --typescript  Use Typescript (tsx)
  -l, --local       Does not explore recursive in current directory.
  --verbose         Display detailed information.
  --debug           Display debug information
  -h, --help        display help for command
```

Usage:
Display list of task information that will create JSS file from CSS file in current directory.
And the task will overwrite created TSX files on exists TSX files.

```bash
$ jss-to-jss list . style --typescript --force
```

## write command

Make JSS file from CSS file.

```bash
Usage: css-to-jss write [options] <source> [prefix]

Make JSS component file from CSS file.

Options:
  -f, --force       Overwrite file
  -t, --typescript  Use Typescript (tsx)
  -l, --local       Does not explore recursive in current directory.
  --verbose         Display detailed information.
  --debug           Display debug information
  -h, --help        display help for command
```

Usage:
Make JSS file from CSS file in current directory.
And overwrite created TSX files on exists TSX files.

```bash
$ jss-to-jss write . style --typescript --force
```
