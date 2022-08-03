import { Alert } from '@aws-amplify/ui-react';
import { useContext } from 'react';
import { SdViewportContext } from '../../shapediver/atoms/SdViewportContext';

export default function SdViewportError() : JSX.Element {

  const {state} = useContext(SdViewportContext);
  const error = state.error

  if (error)
  {
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
  else
  {
    return (<></>)
  }

}
