import fs from 'fs';
import path from 'path';
import { ActionBase, ActionBaseOptions } from '../ActionBase';
import Progress from 'progress';

interface FaultFile {
    filename: string;
    error: Error;
}

type WriteActionOptions = ActionBaseOptions;

export class WriteAction extends ActionBase {
    constructor(options?: WriteActionOptions) {
        super(options);
    }

    public invoke(): void {
        const { force } = this.getOptions();
        const failFiles: FaultFile[] = [];

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

        this.cssFiles.forEach((cssFile) => {
            const needsToWrite = force || !this.isJssExists(cssFile);

            if (needsToWrite) {
                const jssContent = this.getJssContent(cssFile);
                const jssFilename = this.getJssFileName(cssFile);
                try {
                    fs.writeFileSync(jssFilename, jssContent, {
                        encoding: 'utf-8',
                    });
                    writeCount++;
                } catch (e) {
                    failFiles.push({
                        filename: cssFile,
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

        if (failFiles.length > 0) {
            // eslint-disable-next-line no-console
            console.info('Fail files:    ', failFiles.length);
            failFiles.forEach((x) => {
                // eslint-disable-next-line no-console
                console.info('* ', x.filename);
            });
        }

        // eslint-disable-next-line no-console
        console.info('');
    }

    private getJssContent(cssFileName: string): string {
        const css = fs.readFileSync(cssFileName);
        const basename = this.getFilenameWithoutExtension(
            path.basename(cssFileName),
        );
        const componentName = `${basename}Style`;

        return `
/**
 * Auto-generated JSS file by css-to-jss
 */        
import React from 'react;

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
