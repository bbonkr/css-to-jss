# CSS to JSS

[![npm version](https://badge.fury.io/js/%40bbon%2Fcss-to-jss.svg)](https://www.npmjs.com/package/@bbon/css-to-jss) [![npm-publish](https://github.com/bbonkr/css-to-jss/workflows/npm-publish/badge.svg?branch=release)](https://github.com/bbonkr/css-to-jss)

Make JSS component `(jsx|tsx)` file from CSS file in your project.

Run this nodejs cli app in your terminal.

CSS file looks below.

```css
.sample-css {
    color: #ffffff;
}
```

Then (jsx|tsx) looks like.

```typescript
/**
 * Auto-generated JSS file by css-to-jss
 *
 * [@bbon/css-to-jss](https://www.npmjs.com/package/@bbon/css-to-jss)
 */
import React from 'react';

const OtherStyle = () => {
    return (
        <style jsx>{`
            .sample-css {
                color: #ffffff;
            }
        `}</style>
    );
};

export default OtherStyle;
```

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
$ css-to-jss list --help
Usage: css-to-jss list [options] <source> [prefix]

Check the list of files to be processing.

Arguments:
  source            [Required] Set to start location where css files search.
  prefix            [Optional] Set react component file name postfix when files search. default: "style"

Options:
  -f, --force       Overwrite file
  -t, --typescript  Use Typescript (tsx)
  -r, --recursive   Explore recursive from current directory.
  --verbose         Display detailed information.
  --debug           Display debug information
  -h, --help        display help for command
```

Usage:
Display list of task information that will create JSS file from CSS file in current directory.
And the task will overwrite created TSX files on exists TSX files.

```bash
$ css-to-jss list . style --typescript --recursive --force
```

## write command

Make JSS file from CSS file.

```bash
$ css-to-jss write --help
Usage: css-to-jss write [options] <source> [prefix]

Make JSS component file from CSS file.

Arguments:
  source            [Required] Set to start location where css files search.
  prefix            [Optional] Set react component file name postfix when files create. default: "style"

Options:
  -f, --force       Overwrite file
  -t, --typescript  Use Typescript (tsx)
  -r, --recursive   Explore recursive from current directory.
  --verbose         Display detailed information.
  --debug           Display debug information
  -h, --help        display help for command
```

Usage:
Make JSS file from CSS file in current directory.
And overwrite created TSX files on exists TSX files.

```bash
$ css-to-jss write . style --typescript --recursive --force
```
