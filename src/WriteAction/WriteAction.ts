import fs from 'fs';
import path from 'path';
import camelCase from 'camelcase';

import { ActionBase, ActionBaseOptions } from '../ActionBase';
import Progress from 'progress';

interface ProcessedFile {
    /**
     * css file path
     */
    cssFile: string;
    /**
     * jsx|tsx file path
     */
    jssFile: string;
    /**
     * is done
     */
    done: boolean;
    /**
     * error
     */
    error?: Error;
}

interface JssFileInfo {
    /**
     * jsx|tsx file path
     */
    filename: string;
    /**
     * jss component code
     */
    content: string;
}

type WriteActionOptions = ActionBaseOptions;

/**
 * Write action
 *
 * @export
 * @class WriteAction
 * @extends {ActionBase}
 */
export class WriteAction extends ActionBase {
    constructor(options?: WriteActionOptions) {
        super(options);
    }

    /**
     * run write file.
     */
    public invoke(): void {
        const { force, useVerbose } = this.getOptions();
        const processedFiles: ProcessedFile[] = [];

        let processCount = 0;
        let writeCount = 0;

        this.printInfo();
        this.print('');

        const progress = new Progress(
            `${'Progress:'.padEnd(this.MESSAGE_KEY_WIDTH, ' ')} [:bar]`,
            {
                total: this.getTargetFileCount(),
                complete: '=',
                incomplete: ' ',
                width:
                    this.CONSOLE_WIDTH_MAX - this.MESSAGE_KEY_WIDTH - (1 + 2),
                clear: true,
            },
        );

        this.getCssFiles().forEach((cssFile) => {
            const needsToWrite = force || !this.isJssExists(cssFile);

            if (needsToWrite) {
                const {
                    filename: jssFilename,
                    content: jssContent,
                } = this.getJssContent(cssFile);

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

        this.print('-'.padEnd(80, '-'));
        this.print('Result:');
        this.print('-'.padEnd(80, '-'));
        this.print(
            'Process files:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            processCount,
        );
        this.print(
            'Write files:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            writeCount,
        );
        this.print('');

        const printCandidate = processedFiles.filter(
            (x) => useVerbose || (!useVerbose && !x.done),
        );

        if (!useVerbose && printCandidate.length > 0) {
            this.print(
                'Fail files:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
                processedFiles.length,
            );
        }

        printCandidate.forEach((file, index) => {
            this.print(
                `[${index + 1}] ${file.done ? '✅' : '❌'} ${path.dirname(
                    file.cssFile,
                )}: ${path.basename(file.cssFile)} ➡ ${path.basename(
                    file.jssFile,
                )}`,
            );
        });

        this.print('');
    }

    /**
     * JSS component content
     *
     * @private
     * @param {string} cssFileName
     * @returns {JssFileInfo}
     * @memberof WriteAction
     */
    private getJssContent(cssFileName: string): JssFileInfo {
        const jssFilename = this.getJssFileName(cssFileName);

        const css = fs.readFileSync(cssFileName);
        const basename = this.getFilenameWithoutExtension(
            path.basename(jssFilename),
        );

        const cssConstanceName = camelCase(basename, { pascalCase: false });
        const componentName = camelCase(basename, { pascalCase: true });

        return {
            filename: jssFilename,
            content: `/**
 * Auto-generated JSS file by css-to-jss
 * 
 * [@bbon/css-to-jss](https://www.npmjs.com/package/@bbon/css-to-jss)
 * 
 * usage:
 * \`\`\`
 * import { ${cssConstanceName} } from './${basename}'
 *  
 * <style jsx>{${cssConstanceName}}</style>
 * \`\`\`
 */
import React from 'react';
import css from 'styled-jsx/css'

export const ${cssConstanceName} = css\`
            ${css}
\`;

/**
 * Not working currently
 */
const ${componentName} = () => {
    return (
        <style jsx>{${cssConstanceName}}</style>
    )};

export default ${componentName};
`,
        };
    }
}
