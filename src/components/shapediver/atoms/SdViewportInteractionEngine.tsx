import { IMaterialStandardDataProperties, MaterialStandardData } from "@shapediver/viewer";
import {DragManager, HoverManager, InteractionEngine, SelectManager} from "@shapediver/viewer.features.interaction";
import { ReactNode, useContext, useEffect } from "react";
import { SdViewportContext } from "./SdViewportContext";

interface Props {
  children? : ReactNode
  /** Options for selected objects, see https://help.shapediver.com/doc/interactions-part-1 */
  selectManager? : {
    effectMaterial? : IMaterialStandardDataProperties
  }
  /** Options for hovered objects, see https://help.shapediver.com/doc/interactions-part-1 */
  hoverManager? : {
    effectMaterial? : IMaterialStandardDataProperties
  }
  /** Options for dragged objects, see https://help.shapediver.com/doc/interactions-part-2 */
  dragManager? : {
    effectMaterial? : IMaterialStandardDataProperties
  }
}

export default function SdViewportInteractionEngine({children, selectManager, hoverManager, dragManager} : Props) : JSX.Element {

  const {state} = useContext(SdViewportContext);
  const viewport = state.viewport;

  useEffect( () => {
    if (viewport) {
      console.log(`Adding interaction engine for viewport ${viewport.id}`)
      
      const engine = new InteractionEngine(viewport);
      if (selectManager) {
        const manager = new SelectManager();
        if (selectManager.effectMaterial) {
          manager.effectMaterial = new MaterialStandardData(selectManager.effectMaterial);
        }
        engine.addInteractionManager(manager);
      }

      if (hoverManager) {
        const manager = new HoverManager();
        if (hoverManager.effectMaterial) {
          manager.effectMaterial = new MaterialStandardData(hoverManager.effectMaterial);
        }
        engine.addInteractionManager(manager);
      }

      if (dragManager) {
        const manager = new DragManager();
        if (dragManager.effectMaterial) {
          manager.effectMaterial = new MaterialStandardData(dragManager.effectMaterial);
        }
        engine.addInteractionManager(manager);
      }

      return () => {
        console.log(`TODO Removing interaction engine for viewport ${viewport.id}`)

        // TODO to be implemented once InteractionEngine supports listing interaction managers and removing from the viewport
        // https://shapediver.atlassian.net/browse/SS-5492
  
      }
    } 
  }, [viewport, selectManager, hoverManager, dragManager]);

  // TODO provide interaction engine using a context

  return (
    <>
      {children}
    </>
  )
}
