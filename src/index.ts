#!/usr/bin/env node

import { Command } from 'commander';
import { ListAction } from './ListAction';
import { WriteAction } from './WriteAction';

const app = new Command('css-to-jss');

const checker = new Command('list');

checker
    .arguments('list')
    .description('Check the list of files to be processed.')
    .action((args) => {
        const { source, force, typescript } = app;

        const check = new ListAction({
            source: source,
            force: force,
            useTypescript: Boolean(typescript),
        });
        check.invoke();
    });

const writer = new Command('write');
writer
    .arguments('write')
    .description('Make JSS file from CSS file.')
    .action((args) => {
        const { source, force, typescript } = app;

        const writer = new WriteAction({
            source: source,
            force: force,
            useTypescript: Boolean(typescript),
        });
        writer.invoke();
    });

app.version('v0.1.0', '-v, --version', 'Display version')
    .helpOption(false)
    .option('-s, --source <source>', 'Source location', '.')
    .option('-t, --typescript', 'Use Typescript (tsx)')
    .option('-f, --force', 'Overwrite file')
    .addCommand(checker, { isDefault: true })
    .addCommand(writer)
    .addHelpCommand('help', 'Display help for css-to-jss')
    .parse(process.argv);

export default app;
