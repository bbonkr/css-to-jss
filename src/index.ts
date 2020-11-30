#!/usr/bin/env node

import { Command } from 'commander';
import { OptionParser } from './OptionParser';
import { ListAction } from './ListAction';
import { WriteAction } from './WriteAction';

const app = new Command('css-to-jss');

const listCommand = new Command('list');
listCommand
    .arguments('list <source> [prefix]')
    .description('Check the list of files to be processing.', {
        source: '[Required] Set to start location where css files search.',
        prefix:
            '[Optional] Set react component file name postfix when files search. default: "style"',
    })
    .option('-f, --force', 'Overwrite file')
    .option('-t, --typescript', 'Use Typescript (tsx)')
    .option('-r, --recursive', 'Explore recursive from current directory.')
    .option('--verbose', 'Display detailed information.')
    .option('--debug', 'Display debug information')
    .action(() => {
        const options = OptionParser.Parse(
            listCommand.args,
            listCommand.opts(),
        );

        const check = new ListAction({
            ...options,
        });

        check.invoke();
    });

const writerCommand = new Command('write');
writerCommand
    .arguments('write <source> [prefix]')
    .description('Make JSS component file from CSS file.', {
        source: '[Required] Set to start location where css files search.',
        prefix:
            '[Optional] Set react component file name postfix when files create. default: "style"',
    })
    .option('-f, --force', 'Overwrite file')
    .option('-t, --typescript', 'Use Typescript (tsx)')
    .option('-r, --recursive', 'Explore recursive from current directory.')
    .option('--verbose', 'Display detailed information.')
    .option('--debug', 'Display debug information')
    .action(() => {
        const options = OptionParser.Parse(
            writerCommand.args,
            writerCommand.opts(),
        );

        const writer = new WriteAction({
            ...options,
        });

        writer.invoke();
    });

app.version('v1.2.0', '-v, --version', 'Display version')
    .description('Make JSS React Component from CSS files.')
    .helpOption(false)
    .allowUnknownOption(false)
    .addCommand(listCommand)
    .addCommand(writerCommand)
    .addHelpCommand('help', 'Display help for css-to-jss')
    .parse(process.argv);

if (process.argv.length === 0) {
    app.exitOverride().help();
}

export default app;
