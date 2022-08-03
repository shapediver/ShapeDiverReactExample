import { ISessionApi } from '@shapediver/viewer';
import { createContext } from 'react';

export interface ISdSessionState {
    name: string
    session? : ISessionApi
    error? : Error
}
type SdSessionAction =
    | { type: 'setSession', session: ISessionApi}
    | { type: 'resetSession'}
    | { type: 'setError', error: Error}
    | { type: 'resetError'}
    | { type: 'setParameter', id: string, value: string }
    | { type: 'resetParameter', id: string };

export function SdSessionReducer(state: ISdSessionState, action: SdSessionAction): ISdSessionState {
    console.log(action);
    switch (action.type) {
        case 'setSession': {
            return {
                ...state,
                session: action.session
            }
        }
        case 'resetSession': {
            return {
                ...state,
                session: undefined
            }
        }
        case 'setError': {
            return {
                ...state,
                error: action.error
            }
        }
        case 'resetError': {
            return {
                ...state,
                error: undefined
            }
        }
        case 'setParameter': {
            const session = state.session!;
            if (session.parameters[action.id].value !== action.value) {
                session.parameters[action.id].value = action.value;
                session.customize();
            }
            return state;
        }
        case 'resetParameter': {
            const session = state.session!;
            const parameter = session.parameters[action.id]
            parameter.value = parameter.defval;
            session.customize();
            return state;
        }
    }
}

interface ISdSessionContext {
    state: ISdSessionState
    dispatch?: React.Dispatch<SdSessionAction>
}

const SdSessionContextInitial : ISdSessionContext = {
    state: {name: ''}
}

export const SdSessionContext = createContext<ISdSessionContext>(SdSessionContextInitial);
