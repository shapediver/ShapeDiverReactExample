import { useContext } from 'react';
import { SdSessionContext } from '../../shapediver/atoms/SdSessionContext';
import { Alert, Collection, Loader, ScrollView } from '@aws-amplify/ui-react';
import { Slider } from '../atoms/Slider';

export default function SdSessionParameterPanel() : JSX.Element {

  // TODO refactor based on parametersSlice

  const {state} = useContext(SdSessionContext);
  const error = state.error;
  const session = state.session;

  if (error) {
    return (
      <Alert
        variation="error"
        isDismissible={false}
        hasIcon={true}
        heading={error.name}
      >
        {error.message}
      </Alert>
    )
  }
  else if (session)
  {
    const parameterIds = Object.keys(session.parameters)
      .filter(id => session.parameters[id].visualization === 'slider')
    
    return (
      <ScrollView maxHeight="100%">
        <Collection 
          type="list"
          items={parameterIds}
          direction="column"
        >
          {(item, index) => {
            return (
              <Slider 
                key={index}
                paramid={item}
              />
            )
          }}
        </Collection>
      </ScrollView>
    );
  }
  else 
  {
    return (<Loader size="large"/>)
  }
}
