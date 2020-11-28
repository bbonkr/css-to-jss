import { ActionBaseOptions } from '../ActionBase';

interface CommandOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export class OptionParser {
    public static Parse(
        commandArguments: string[],
        commandOptions: CommandOptions,
    ): ActionBaseOptions {
        const { force, typescript, recursive, verbose, debug } = commandOptions;
        const sourceDirectory =
            commandArguments.length > 0 ? commandArguments[0] : '';
        const postfix =
            commandArguments.length > 1 ? commandArguments[1] : undefined;

        const options: ActionBaseOptions = {
            source: sourceDirectory,
            postfix: postfix ?? '',
            force: force,
            useTypescript: Boolean(typescript),
            useRecursive: Boolean(recursive),
            useVerbose: Boolean(verbose),
            useDebug: Boolean(debug),
        };

        return options;
    }
}
