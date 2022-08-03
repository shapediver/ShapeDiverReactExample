import { IViewportApi } from '@shapediver/viewer';
import { createContext } from 'react';

export interface ISdViewportState {
    viewport? : IViewportApi
    error? : Error
}
type SdViewportAction =
    | { type: 'setViewport', viewport: IViewportApi}
    | { type: 'resetViewport'}
    | { type: 'setError', error: Error}
    | { type: 'resetError'}
  
export function SdViewportReducer(state: ISdViewportState, action: SdViewportAction): ISdViewportState {
    console.log(action);
    switch (action.type) {
        case 'setViewport': {
            return {
                ...state,
                viewport: action.viewport
            }
        }
        case 'resetViewport': {
            return {
                ...state,
                viewport: undefined
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
    }
}

interface ISdViewportContext {
    state: ISdViewportState
    dispatch?: React.Dispatch<SdViewportAction>
}

const SdViewportContextInitial : ISdViewportContext = {
    state: {}
}

export const SdViewportContext = createContext<ISdViewportContext>(SdViewportContextInitial);
