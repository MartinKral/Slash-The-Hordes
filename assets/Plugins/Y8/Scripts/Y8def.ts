declare global {
    const ID: Y8API.ID;
    interface Window {
        idAsyncInit: () => void;
    }
}

export namespace Y8API {
    export interface ID {
        init: (appInfo: { appId: string }) => void;
        getLoginStatus: (callback: (response?: Authorization) => void, skipCache?: boolean) => void;
        login: (callback: (response?: Authorization) => void) => void;
        register: (callback: (response?: Authorization) => void) => void;
        Event: Event;
        Analytics: Analytics;
    }

    export interface Event {
        subscribe: (eventName: string, callback: (response?: any) => void) => void;
    }

    export interface Analytics {
        custom_event: (name: string, data?: string | number) => void;
    }

    export interface Authorization {
        status: string;
        success?: boolean;
        authResponse: {
            state: string;
            access_token: string;
            token_type: string;
            expires_in: number;
            scope: string;
            redirect_uri: string;
            details: any;
        };
    }
}
