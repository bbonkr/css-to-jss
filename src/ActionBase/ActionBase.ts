import path from 'path';
import glob from 'glob';

export interface ActionBaseOptions {
    source: string;
    force: boolean;
    postfix: string;
    useTypescript: boolean;
    useRecursive: boolean;
    useVerbose: boolean;
    useDebug: boolean;
}

/**
 * action base
 */
export abstract class ActionBase {
    public POSTFIX = 'style' as const;
    public MESSAGE_KEY_WIDTH = 24 as const;
    public CONSOLE_WIDTH_MAX = 80 as const;

    constructor(options?: ActionBaseOptions) {
        this.options = options ?? {
            source: '.',
            force: false,
            postfix: this.POSTFIX,
            useTypescript: false,
            useDebug: false,
            useRecursive: false,
            useVerbose: false,
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
            this.print('[DEBUG] css-to-jss Options:');
            this.print(this.options);
            this.print('');
        }

        this.cssFiles = [];
        this.jssFiles = [];

        this.initialize();
    }

    /**
     * message display
     *
     * @param {...any[]} data
     * @memberof ActionBase
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public print(...data: any[]): void {
        // eslint-disable-next-line no-console
        console.info(...data);
    }

    /**
     * Initialize with options
     */
    private initialize(): void {
        const { postfix, useTypescript, useRecursive } = this.options;
        const rootDir = this.getRootDir();

        const globOptions: glob.IOptions = {
            cwd: rootDir,
            absolute: true,
            ignore: ['node_modules/**/*'],
        };

        let globPattern = '';

        if (useRecursive) {
            globPattern = '**/';
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

    /**
     * print a information out to console
     */
    protected printInfo(): void {
        const { useVerbose } = this.options;

        this.print('-'.padEnd(this.CONSOLE_WIDTH_MAX, '-'));
        this.print('Configuration');
        this.print('-'.padEnd(this.CONSOLE_WIDTH_MAX, '-'));

        this.print(
            `Root directory:`.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            this.getRootDir(),
        );
        this.print(
            'Recursive explore:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            this.getOptions().useRecursive,
        );

        this.print(
            'Use typescript:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            Boolean(this.getOptions().useTypescript),
        );

        this.print(
            'Overwrite JSS file:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            Boolean(this.getOptions().force),
        );

        this.print('');
        this.print('-'.padEnd(this.CONSOLE_WIDTH_MAX, '-'));
        this.print('Task inforation');
        this.print('-'.padEnd(this.CONSOLE_WIDTH_MAX, '-'));

        this.print(
            'CSS files:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            this.getCssFileCount(),
        );
        this.print(
            'JSS already:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            this.getJssFileCount(),
        );
        this.print(
            'Target files:'.padEnd(this.MESSAGE_KEY_WIDTH, ' '),
            this.getTargetFileCount(),
        );

        if (useVerbose) {
            this.print('');
            this.print('-'.padEnd(this.CONSOLE_WIDTH_MAX, '-'));
            this.print('CSS files found:');
            this.print('-'.padEnd(this.CONSOLE_WIDTH_MAX, '-'));
            this.cssFiles.forEach((cssFile, index) => {
                this.print(`[${index + 1}] 📢 ${cssFile}`);
            });
        }
    }

    /**
     * get filename without extension
     *
     * @param filename
     */
    protected getFilenameWithoutExtension(filename: string): string {
        return filename.split('.').slice(0, -1).join('.');
    }

    /**
     * check jsx|tsx file exists
     *
     * @param cssFilename
     */
    protected isJssExists(cssFilename: string): boolean {
        const jssFilename = this.getJssFileName(cssFilename);

        const index = this.jssFiles.findIndex(
            (x) => x.toLowerCase() === jssFilename.toLowerCase(),
        );

        return index > -1;
    }

    /**
     * Get jsx|tsx file name
     *
     * @protected
     * @param {string} cssFilename
     * @returns {string}
     * @memberof ActionBase
     */
    protected getJssFileName(cssFilename: string): string {
        const { postfix, useTypescript } = this.options;
        const jssFilename = `${this.getFilenameWithoutExtension(cssFilename)}.${
            postfix ?? this.POSTFIX
        }.${useTypescript ? 'tsx' : 'jsx'}`;

        return jssFilename;
    }

    /**
     * get start location where css files search
     *
     * @protected
     * @returns {string}
     * @memberof ActionBase
     */
    protected getRootDir(): string {
        const { source } = this.options;

        return path.resolve(source);
    }

    /**
     * get options
     */
    protected getOptions(): ActionBaseOptions {
        return this.options;
    }

    /**
     * get count of found css files
     */
    protected getCssFileCount(): number {
        return this.cssFiles.length;
    }

    /**
     * get count of found jsx|tsx files
     */
    protected getJssFileCount(): number {
        return this.jssFiles.length;
    }

    /**
     * get count of candidate files
     */
    protected getTargetFileCount(): number {
        const { force } = this.options;
        return this.cssFiles.length - (force ? 0 : this.jssFiles.length);
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
