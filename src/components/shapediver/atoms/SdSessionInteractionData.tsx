import { InteractionData } from "@shapediver/viewer.features.interaction";
import { ITreeNode } from "@shapediver/viewer.shared.node-tree";
import { useContext, useEffect } from "react";
import { SdSessionContext } from "./SdSessionContext";

interface Props {
  /** Optional unique id for identifying the interaction data which will be attached to the nodes of the scene tree */
  interactionDataId?: string
  /** Types of interactions to enable, see https://help.shapediver.com/doc/interactions-part-1 */
  interactionTypes: {
    select?: boolean
    drag?: boolean
    hover?: boolean
  }
  /** Level of children at which the interaction data should be attached, specify 0 for the session's top level scene tree node */
  level: number
}

const getChildrenAtLevel = (node: ITreeNode, level: number) : ITreeNode[] => {
  if (level <= 0)
    return [node];

  return node.children.map(n => getChildrenAtLevel(n, level - 1)).flat();
}

export default function SdSessionInteractionData({interactionDataId, interactionTypes, level} : Props) : JSX.Element {

  const {state} = useContext(SdSessionContext);
  const session = state.session;

  // TODO plug into state management and re-enable interactions after session customization

  useEffect( () => {

    if (session) {
      
      const data = new InteractionData(interactionTypes, interactionDataId);
      
      const nodes = getChildrenAtLevel(session.node, level);
      console.log(`Adding interaction data for ${nodes.length} nodes at level ${level} of session ${session.id}`)
      
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].addData(data);
      }

      return () => {
        console.log(`Removing interaction data for session ${session.id}`)

        for (let i = 0; i < nodes.length; i++) {
          nodes[i].removeData(data);
        }
      }
    } 
  }, [session, interactionDataId, interactionTypes, level]);

  return (
    <>
    </>
  )
}
