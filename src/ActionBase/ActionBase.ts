import path from 'path';
import glob from 'glob';

export interface ActionBaseOptions {
    source: string;
    force: boolean;
    postfix?: string;
    useTypescript?: boolean;
}

export abstract class ActionBase {
    public POSTFIX = 'style' as const;

    constructor(options?: ActionBaseOptions) {
        this.options = options ?? {
            source: '.',
            force: false,
            postfix: this.POSTFIX,
            useTypescript: false,
        };

        if (options && !options.source) {
            this.options = {
                ...this.options,
                source: '.',
            };
        }

        if (options && !options.postfix) {
            this.options = {
                ...this.options,
                postfix: this.POSTFIX,
            };
        }

        this.cssFiles = [];
        this.jssFiles = [];

        this.initialize();
    }

    private initialize(): void {
        const { source, force, postfix, useTypescript } = this.options;
        const rootDir = path.resolve(source);

        const cssFiles = glob.sync('**/*.css', {
            root: rootDir,
            ignore: ['node_modules/**/*'],
        });

        this.cssFiles = [...cssFiles];

        const jssFiles = glob.sync(
            `**/*.${postfix ?? this.POSTFIX}.${useTypescript ? 'tsx' : 'jsx'}`,
            {
                root: rootDir,
                ignore: ['node_modules/**/*'],
            },
        );

        const filteredJssFile = jssFiles.filter((file) => {
            const index = cssFiles.findIndex(
                (x) =>
                    `${this.getFilenameWithoutExtension(x)}.${
                        postfix ?? this.POSTFIX
                    }`.toLowerCase() ===
                    this.getFilenameWithoutExtension(file).toLowerCase(),
            );

            return index > -1;
        });

        this.jssFiles = [...filteredJssFile];
    }

    protected printInfo(): void {
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));
        // eslint-disable-next-line no-console
        console.info('Configuration');
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));
        // eslint-disable-next-line no-console
        console.info('Root directory:     ', this.getRootDir());
        // eslint-disable-next-line no-console
        console.info(
            'Use typescript:     ',
            Boolean(this.getOptions().useTypescript),
        );
        // eslint-disable-next-line no-console
        console.info('Overwrite JSS file: ', Boolean(this.getOptions().force));

        // eslint-disable-next-line no-console
        console.info('');
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));
        // eslint-disable-next-line no-console
        console.info('Task inforation');
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));

        // eslint-disable-next-line no-console
        console.info('CSS files:          ', this.getCssFileCount());
        // eslint-disable-next-line no-console
        console.info('JSS already:        ', this.getJssFileCount());
        // eslint-disable-next-line no-console
        console.info('Target files:       ', this.getTargetFileCount());
    }

    protected getFilenameWithoutExtension(filename: string): string {
        return filename.split('.').slice(0, -1).join('.');
    }

    protected isJssExists(cssFilename: string): boolean {
        const jssFilename = this.getJssFileName(cssFilename);

        const index = this.jssFiles.findIndex(
            (x) => x.toLowerCase() === jssFilename.toLowerCase(),
        );

        return index > -1;
    }

    protected getJssFileName(cssFilename: string): string {
        const jssFilename = `${this.getFilenameWithoutExtension(cssFilename)}.${
            this.POSTFIX
        }.${this.getOptions().useTypescript ? 'tsx' : 'jsx'}`;

        return jssFilename;
    }

    protected getRootDir(): string {
        const { source } = this.options;

        return path.resolve(source);
    }

    protected getOptions(): ActionBaseOptions {
        return this.options;
    }

    protected getCssFileCount(): number {
        return this.cssFiles.length;
    }

    protected getJssFileCount(): number {
        return this.jssFiles.length;
    }

    protected getTargetFileCount(): number {
        const { force } = this.options;
        return this.cssFiles.length - (force ? 0 : this.jssFiles.length);
    }

    protected cssFiles: string[];
    protected jssFiles: string[];
    private options: ActionBaseOptions;
}
