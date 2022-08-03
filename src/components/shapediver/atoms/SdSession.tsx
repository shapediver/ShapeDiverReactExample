import { ISessionApi, createSession } from '@shapediver/viewer'; 
import { useEffect, useRef, ReactNode, useReducer } from 'react';
import { SdSessionContext, SdSessionReducer } from './SdSessionContext';

interface Props {
  /** Ticket for a ShapeDiver model, see https://help.shapediver.com/doc/enable-embedding */
  ticket: string
  /** model view URL of the ShapeDiver model, see https://help.shapediver.com/doc/enable-embedding */
  modelViewUrl: string
  children: ReactNode
  /** optional name for the session, used for identifying parameters in case of multiple sessions */
  name?: string
}

export default function SdSession({ticket, modelViewUrl, children, name} : Props) : JSX.Element {

  const sessionPromiseRef = useRef<Promise<ISessionApi | void>>(Promise.resolve());
  const [state, dispatch] = useReducer(SdSessionReducer, {name: name ?? 'Session_001'});

  useEffect( () => {
    
    sessionPromiseRef.current = sessionPromiseRef.current
    .then(() => createSession({
      ticket: ticket,
      modelViewUrl: modelViewUrl,
      loadOutputs: true
    }))
    .then(
      s => {
        dispatch({type: 'setSession', session: s}); 
        dispatch({type: 'resetError'}); 
        return s;
      }, 
      e => dispatch({type: 'setError', error: e})
    );
    
    return () => {
      console.log(`Cleaning up session for ticket ${ticket.substring(0, 30)}…, modelViewUrl ${modelViewUrl} (might happen due to React strict mode during development)`)
      sessionPromiseRef.current = sessionPromiseRef.current
      .then(
        s => {
          s && s.close();
          dispatch({type: 'resetSession'}); 
          dispatch({type: 'resetError'});
        }
      );
    }
  }, [ticket, modelViewUrl]);

  return (
    <SdSessionContext.Provider value={{state: state, dispatch: dispatch}}>
      {children}
    </SdSessionContext.Provider>
  )
}
