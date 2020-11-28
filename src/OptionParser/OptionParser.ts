import { ActionBaseOptions } from '../ActionBase';

interface CommandOptions {
    [key: string]: any;
}

export class OptionParser {
    public static Parse(
        commandArguments: string[],
        commandOptions: CommandOptions,
    ): ActionBaseOptions {
        const { force, typescript, local, verbose, debug } = commandOptions;
        const sourceDirectory =
            commandArguments.length > 0 ? commandArguments[0] : '';
        const postfix =
            commandArguments.length > 1 ? commandArguments[1] : undefined;

        const options: ActionBaseOptions = {
            source: sourceDirectory,
            postfix: postfix,
            force: force,
            useTypescript: Boolean(typescript),
            localOnly: Boolean(local),
            useVerbose: Boolean(verbose),
            useDebug: Boolean(debug),
        };

        return options;
    }
}
