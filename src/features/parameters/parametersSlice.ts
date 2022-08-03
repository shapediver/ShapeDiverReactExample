import { createSlice, createEntityAdapter, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { ISessionApi } from '@shapediver/viewer';
import { RootState } from '../../app/store';

/**
 * Entity
 */

interface IParameter {
    id: string
    type: string
    name: string
    value: string
    defval: string

    session?: {
        name: string
        parameterId: string
    }
   
    choices?: string[]
    decimalplaces?: number
    displayname?: string
    format?: string[]
    group?: {
        id: string
        name: string
    }
    hidden?: boolean
    hint?: string
    max?: number
    min?: number
    order?: number
    structure?: string
    tooltip?: string
    visualization?: string
}

/*
interface ParameterState {
    parameters : {
        byId : { [id : string] : IParameter }
    }
}

const initialState : ParameterState = {
    parameters : {
        byId : {}
    }
}
*/

/**
 * Entity adapter
 */

const parametersAdapter = createEntityAdapter<IParameter>({
    selectId: (param) => param.id,
})


/**
 * Thunks
 */

export const thunkRegisterSession = (data : {session: ISessionApi, name: string}): ThunkAction<void, RootState, unknown, AnyAction> =>
    async dispatch => {
        const sessionParams = data.session.parameters;
        const ids = Object.keys(sessionParams);
        const params = ids.map((id) : IParameter => {
            const p = sessionParams[id];
            // map (validation missing)
            return {
                // required properties
                id: `${data.name}:${p.id}`,
                type: p.type,
                name: p.name,
                value: p.value + '',
                defval: p.defval,
                // session
                session: {
                    name: data.name,
                    parameterId: p.id
                },
                // optional properties
                choices: p.choices,
                decimalplaces: p.decimalplaces,
                displayname: p.displayname,
                format: p.format, 
                group: p.group,
                hidden: p.hidden,
                hint: p.hint,
                max: p.max,
                min: p.min,
                order: p.order,
                structure: p.structure,
                tooltip: p.tooltip,
                visualization: p.visualization,
            }
        })
        dispatch(upsertParameters(params));
    }

export const thunkDeregisterSession = (data : {name: string}): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        const state = getState();
        const parameters = state.parameters; // <-- should move into selectParameters
        const ids = parameters.ids.filter(id => parameters.entities[id]?.session?.name === data.name);
        dispatch(removeParameters(ids));
    }


/**
 * Actions
 */



/**
 * Reducer
 */

export const parametersSlice = createSlice({
    name: 'parameters',
    initialState: parametersAdapter.getInitialState(),
    reducers: {
        addParameter: parametersAdapter.addOne,
        upsertParameter: parametersAdapter.upsertOne,
        upsertParameters: parametersAdapter.upsertMany,
        removeParameter: parametersAdapter.removeOne,
        removeParameters: parametersAdapter.removeMany,
    }
})

export const { 
    addParameter, 
    upsertParameter, 
    upsertParameters, 
    removeParameter, 
    removeParameters 
} = parametersSlice.actions

export default parametersSlice.reducer
