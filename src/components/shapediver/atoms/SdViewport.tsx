import { createViewport, IViewportApi } from '@shapediver/viewer'; 
import { ReactNode, useEffect, useReducer, useRef } from 'react';
import { SdViewportContext, SdViewportReducer } from './SdViewportContext';

interface Props {
  /** use a unique identifier for each viewport */
  viewportId : string
  children? : ReactNode
}

export default function SdViewport({viewportId, children} : Props) : JSX.Element {

  const viewportPromiseRef = useRef<Promise<IViewportApi | void>>(Promise.resolve());
  const canvasRef = useRef(null);
  const [state, dispatch] = useReducer(SdViewportReducer, {});

  useEffect( () => {
  
    viewportPromiseRef.current = viewportPromiseRef.current
    .then(() => createViewport({
      canvas: canvasRef.current!,
      id: viewportId,
    }))
    .then(
      v => {
        dispatch({type: 'setViewport', viewport: v}); 
        dispatch({type: 'resetError'}); 
        return v;
      }, 
      e => dispatch({type: 'setError', error: e}) 
    );

    return () => {
      console.log(`Cleaning up viewport ${viewportId} (might happen due to React strict mode during development)`);
      viewportPromiseRef.current = viewportPromiseRef.current
      .then(
        v => {
          v && v.close(); 
          dispatch({type: 'resetViewport'}); 
          dispatch({type: 'resetError'}); 
        }
      );
    }
  }, [viewportId]);

  if (state.error)
  {
    if (children) 
    {
      return (
        <SdViewportContext.Provider value={{state: state, dispatch: dispatch}}>
          {children}
        </SdViewportContext.Provider>
      )
    }
    else
    {
      return (<></>)
    }
  }
  else
  {
    return (
      <>
        <div style={{height: '100%', position: 'relative'}}>
          <canvas ref={canvasRef}/>
        </div>
        <SdViewportContext.Provider value={{state: state, dispatch: dispatch}}>
          {children}
        </SdViewportContext.Provider>
      </>
    )
  }

}
