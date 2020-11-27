#!/usr/bin/env node

import { Command } from 'commander';
import { ListAction } from './ListAction';
import { WriteAction } from './WriteAction';

const app = new Command();

const checker = new Command('check');

checker.arguments('check').action((args) => {
    const { source, force, typescript } = app;

    const check = new ListAction({
        source: source,
        force: force,
        useTypescript: Boolean(typescript),
    });
    check.invoke();
});

const writer = new Command('write');
writer.arguments('write').action((args) => {
    const { source, force, typescript } = app;

    const writer = new WriteAction({
        source: source,
        force: force,
        useTypescript: Boolean(typescript),
    });
    writer.invoke();
});

app.version('v1.0.0', '-v, --version', 'Display version')
    .helpOption('-h, --help', 'Display help')
    .option('-s, --source <source>', 'Source location', '.')
    .option('-t, --typescript', 'Use Typescript (tsx)')
    .option('-f, --force', 'Overwrite file')
    .addCommand(checker, { isDefault: true })
    .addCommand(writer)
    .parse(process.argv);

export default app;
