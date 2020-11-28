import path from 'path';
import glob from 'glob';

export interface ActionBaseOptions {
    source: string;
    force: boolean;
    postfix?: string;
    useTypescript?: boolean;
    localOnly?: boolean;
    useVerbose?: boolean;
    useDebug?: boolean;
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

        if (this.options.useDebug) {
            // eslint-disable-next-line no-console
            console.info('css-to-jss Options:');
            // eslint-disable-next-line no-console
            console.table(this.options);
        }

        this.cssFiles = [];
        this.jssFiles = [];

        this.initialize();
    }

    private initialize(): void {
        const { postfix, useTypescript, localOnly } = this.options;
        const rootDir = this.getRootDir();

        const globOptions: glob.IOptions = {
            cwd: rootDir,
            absolute: true,
            ignore: ['node_modules/**/*'],
        };

        let globPattern = '**/';

        if (localOnly) {
            globPattern = '';
        }

        const cssFiles = glob.sync(`${globPattern}*.css`, globOptions);

        this.cssFiles = [...cssFiles];

        const jssFiles = glob.sync(
            `${globPattern}*.${postfix ?? this.POSTFIX}.${
                useTypescript ? 'tsx' : 'jsx'
            }`,
            globOptions,
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
        const { useVerbose } = this.options;
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));
        // eslint-disable-next-line no-console
        console.info('Configuration');
        // eslint-disable-next-line no-console
        console.info('-'.padEnd(80, '-'));

        // eslint-disable-next-line no-console
        console.info('Root directory:     ', this.getRootDir());
        // eslint-disable-next-line no-console
        console.info('Local only:         ', this.getOptions().localOnly);
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

        if (useVerbose) {
            // eslint-disable-next-line no-console
            console.info('');
            // eslint-disable-next-line no-console
            console.info('-'.padEnd(80, '-'));
            // eslint-disable-next-line no-console
            console.info('CSS files found:');
            // eslint-disable-next-line no-console
            console.info('-'.padEnd(80, '-'));
            this.cssFiles.forEach((cssFile) => {
                // eslint-disable-next-line no-console
                console.info(` * ${cssFile}`);
            });
        }
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
        const { postfix, useTypescript } = this.options;
        const jssFilename = `${this.getFilenameWithoutExtension(cssFilename)}.${
            postfix ?? this.POSTFIX
        }.${useTypescript ? 'tsx' : 'jsx'}`;

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

    protected getCapitalCase(str: string): string {
        if (!str || str.length === 0) {
            throw 'Requires 2 characters at least';
        }
        if (str.length > 0) {
            const first = str.substr(0, 1);
            let remainder = '';
            if (str.length > 1) {
                remainder = str.substr(1);
            }
            return `${first.toUpperCase()}${remainder}`;
        }
        return str;
    }

    protected getCssFiles(): string[] {
        return this.cssFiles;
    }

    protected getJssFiles(): string[] {
        return this.jssFiles;
    }

    private cssFiles: string[];
    private jssFiles: string[];
    private options: ActionBaseOptions;
}
