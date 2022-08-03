import './App.css';
import SdSession from './components/shapediver/atoms/SdSession';
import SdViewport from './components/shapediver/atoms/SdViewport';
import SdSessionParameterPanel from './components/ui-kit/molecules/SdSessionParameterPanel';
import SdViewportError from './components/ui-kit/atoms/SdViewportError';
import { Card, Flex, Grid, SliderField, TextField } from '@aws-amplify/ui-react';
import { ChangeEvent, useState } from 'react';
import SdSessionParameterBridge from './features/parameters/SdSessionParameterBridge';
import SdViewportInteractionEngine from './components/shapediver/atoms/SdViewportInteractionEngine';
import SdSessionInteractionData from './components/shapediver/atoms/SdSessionInteractionData';

const selectManagerData = {effectMaterial: {color: "#ffff00"}};
const interactionTypes = {select: true};

function App() {
  const [ticket, setTicket] = useState('124be652a22830809c7690b6490225e4db653c1b6d065bad26ae3f71ce636017f2784095eba478021d99aff9ed749ff8705f1c20f9edecefade03b27e2a48ddf7f78b8d6fef3c941c6fe48762fc9645c46effd6aa9f620311afc50cd0f294c5d640c16a2edb09d-ebeca640b168d58d6712919abc886168');
  const [modelViewUrl, setModelViewUrl] = useState('https://sddev2.eu-central-1.shapediver.com');
  const [interactionLevel, setInteractionLevel] = useState(1);
  
  return (
    <div className="App">
      <Grid
        className="Grid"
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns="1fr 1fr 1fr 1fr 1fr"
        templateRows="4fr 1fr"
      >
        <Card
          columnStart="1"
          columnEnd="4"
          style={{height: '100vh', maxHeight: '100vh'}}
        >
          <SdViewport viewportId='viewport_1'>
            <SdViewportError/>
            <SdViewportInteractionEngine selectManager={selectManagerData}/>
          </SdViewport>
        </Card>
        <Card
          columnStart="4"
          columnEnd="-1"
          style={{maxHeight: '100vh'}}
        >
          <SdSession
            ticket={ticket}
            modelViewUrl={modelViewUrl}
          >
            <SdSessionInteractionData level={interactionLevel} interactionTypes={interactionTypes}/>
            <SdSessionParameterBridge/>
            <SdSessionParameterPanel/>
          </SdSession>
        </Card>
        <Card
          columnStart="1"
          columnEnd="-1"
        >
          <Flex direction="row">
            <TextField
              placeholder="Ticket for embedding"
              label="Ticket"
              defaultValue={ticket}
              onChange={(e : ChangeEvent<HTMLInputElement>) => setTicket(e.currentTarget.value)}
            />
            <TextField
              placeholder="ModelViewUrl"
              label="ModelViewUrl"
              defaultValue={modelViewUrl}
              onChange={(e : ChangeEvent<HTMLInputElement>) => setModelViewUrl(e.currentTarget.value)}
            />
            <SliderField
              label="Interaction level"
              defaultValue={interactionLevel}
              min={0}
              max={10}
              onChange={(v: number) => setInteractionLevel(v)}
            />
            </Flex>
        </Card>
      </Grid>
    </div>
  );
}

export default App;
