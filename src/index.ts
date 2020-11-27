#!/usr/bin/env node

import { Command } from 'commander';
import { ListAction } from './ListAction';
import { WriteAction } from './WriteAction';

const app = new Command();

const checker = new Command('check');

checker
    .arguments('check')
    // .option('-s, --source <source>', 'Source location', '.')
    // .option(
    //     '-t, --type <type>',
    //     'Use Typescript (tsx) or javascript (jsx)',
    //     'typescript',
    // )
    // .option('-f, --force', 'Overwrite file')
    .action((args) => {
        const { source, force, typescript } = app;

        const check = new ListAction({
            source: source,
            force: force,
            useTypescript: Boolean(typescript),
        });
        check.invoke();
    });
// // .parse(process.argv);

const writer = new Command('write');
writer
    .arguments('write')
    // .option('-s, --source <source>', 'Source location')
    // .option('-t, --type <type>', 'Use Typescript (tsx) or javascript (jsx)')
    // .option('-f, --force', 'Overwrite file')
    .action((args) => {
        const { source, force, typescript } = app;

        const writer = new WriteAction({
            source: source,
            force: force,
            useTypescript: Boolean(typescript),
        });
        writer.invoke();
    });
// // .parse(process.argv);

app.version('v1.0.0', '-v, --version', 'Display version')
    .helpOption('-h, --help', 'Display help')
    .option('-s, --source <source>', 'Source location')
    .option('-t, --typescript', 'Use Typescript (tsx)')
    .option('-f, --force', 'Overwrite file')
    .addCommand(checker, { isDefault: true })
    .addCommand(writer)
    // .command('check <check>')
    // .alias('c')
    // .action((args) => {
    //     console.info('args: ', args);
    //     const { source, force, type } = app;
    //     const check = new Check({
    //         source: source,
    //         force: force,
    //         useTypescript:
    //             typeof type === 'string' && type.toLowerCase() === 'typescript',
    //     });
    //     check.run();
    // })
    // .command('write <write>')
    // .alias('w')
    // .action((args) => {
    //     const { source, force, type } = app;
    //     const writer = new Writer({
    //         source: source,
    //         force: force,
    //         useTypescript:
    //             typeof type === 'string' && type.toLowerCase() === 'typescript',
    //     });
    //     writer.run();
    // })

    .parse(process.argv);
