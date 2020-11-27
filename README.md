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

Options:
  -v, --version          Display version
  -s, --source <source>  Source location (default: ".")
  -t, --typescript       Use Typescript (tsx)
  -f, --force            Overwrite file

Commands:
  list                   Check the list of files to be processed.
  write                  Make JSS file from CSS file.
  help                   Display help for css-to-jss
```

### list command

Check the list of files to be processed.

Usage:
Display list of task information that will create JSS file from CSS file in current directory.
And the task will overwrite created TSX files on exists TSX files.

```bash
$ jss-to-jss --source . --typescript --force list
```

## write command

Make JSS file from CSS file.

Usage:
Make JSS file from CSS file in current directory.
And overwrite created TSX files on exists TSX files.

```bash
$ jss-to-jss --source . --typescript --force write
```
