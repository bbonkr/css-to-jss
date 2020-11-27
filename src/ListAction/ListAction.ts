import { ActionBase, ActionBaseOptions } from '../ActionBase';

type ListActionOptions = ActionBaseOptions;

export class ListAction extends ActionBase {
    constructor(options?: ListActionOptions) {
        super(options);
    }

    public invoke(): void {
        this.printInfo();

        // eslint-disable-next-line no-console
        console.info('');
    }
}
