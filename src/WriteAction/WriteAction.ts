import fs from 'fs';
import path from 'path';

import { ActionBase, ActionBaseOptions } from '../ActionBase';
import Progress from 'progress';

interface ProcessedFile {
    cssFile: string;
    jssFile: string;
    done: boolean;
    error?: Error;
}

type WriteActionOptions = ActionBaseOptions;

export class WriteAction extends ActionBase {
    constructor(options?: WriteActionOptions) {
        super(options);
    }

    public invoke(): void {
        const { force, useVerbose } = this.getOptions();
        const processedFiles: ProcessedFile[] = [];

        let processCount = 0;
        let writeCount = 0;

        this.printInfo();

        // eslint-disable-next-line no-console
        console.info('');

        const progress = new Progress('Progress (:percent): [:bar]', {
            total: this.getTargetFileCount(),
            complete: '=',
            incomplete: ' ',
            width: 60,
        });

        if (useVerbose) {
            // eslint-disable-next-line no-console
            console.info('');
        }

        this.getCssFiles().forEach((cssFile) => {
            const needsToWrite = force || !this.isJssExists(cssFile);

            if (needsToWrite) {
                const jssContent = this.getJssContent(cssFile);
                const jssFilename = this.getJssFileName(cssFile);

                try {
                    fs.writeFileSync(jssFilename, jssContent, {
                        encoding: 'utf-8',
                    });
                    writeCount++;

                    processedFiles.push({
                        cssFile: cssFile,
                        jssFile: jssFilename,
                        done: true,
                        error: undefined,
                    });
                } catch (e) {
                    processedFiles.push({
                        cssFile: cssFile,
                        jssFile: jssFilename,
                        done: false,
                        error: e,
                    });
                }
            }

            processCount++;
            progress.tick(1);
        });

        // progress.complete = true;

        // eslint-disable-next-line no-console
        console.info('');
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));
        // eslint-disable-next-line no-console
        console.info('Result:');
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));
        // eslint-disable-next-line no-console
        console.info('Process files:      ', processCount);
        // eslint-disable-next-line no-console
        console.info('Write files:        ', writeCount);
        // eslint-disable-next-line no-console
        console.info('');

        if (useVerbose) {
            processedFiles.forEach((file) => {
                // eslint-disable-next-line no-console
                console.info(
                    `[${processCount + 1}] ${file.done ? '✅' : '❌'} ${
                        file.cssFile
                    } ➡ ${file.jssFile}`,
                );
            });
        } else {
            if (processedFiles.filter((x) => !x.done).length > 0) {
                // eslint-disable-next-line no-console
                console.info('Fail files:    ', processedFiles.length);
                processedFiles
                    .filter((x) => !x.done)
                    .forEach((file) => {
                        // eslint-disable-next-line no-console
                        console.info(
                            `[${processCount + 1}] ${file.done ? '✅' : '❌'} ${
                                file.cssFile
                            } ➡ ${file.jssFile}`,
                        );
                    });
            }
        }

        // eslint-disable-next-line no-console
        console.info('');
    }

    private getJssContent(cssFileName: string): string {
        const { postfix } = this.getOptions();

        const css = fs.readFileSync(cssFileName);
        const basename = this.getCapitalCase(
            this.getFilenameWithoutExtension(path.basename(cssFileName)),
        );
        const componentName = `${basename}${this.getCapitalCase(
            postfix ?? this.POSTFIX,
        )}`;

        return `/**
 * Auto-generated JSS file by css-to-jss
 * 
 * [@bbon/css-to-jss](https://www.npmjs.com/package/@bbon/css-to-jss)
 */

import React from 'react';

const ${componentName} = () => {
    return (
        <style jsx>{\`
            ${css}
        \`}</style>
    )};

export default ${componentName};
`;
    }
}
