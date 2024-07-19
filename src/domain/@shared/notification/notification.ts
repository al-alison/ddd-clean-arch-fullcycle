export type NotificationErrorProps = {
    message: string
    context: string
}

export default class Notification {
    private _errors: NotificationErrorProps[] = [];

    get errors(): NotificationErrorProps[] {
        return this._errors;
    }

    addError(error: NotificationErrorProps) {
        this.errors.push(error);
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    messages(context?: string): string {
        let message = "";
        this.errors.forEach((error) => {
            if (context == undefined || error.context === context){
                message += `${error.context}: ${error.message},`;
            }
        })
        return message;
    }
}