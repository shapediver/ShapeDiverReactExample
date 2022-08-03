# ShapeDiver React template using Amplify UI Kit

This project introduces some best practice React components for using the [ShapeDiver Viewer](https://help.shapediver.com/doc/viewer). 

A good entry point is [`src/App.tsx`](src/App.tsx). 

:warning: Work in progress, please expect frequent changes and refactoring! 

## Viewer components

See [`src/components/shapediver/atoms`](src/components/shapediver/atoms).

### `SdSession`

Creates (and cleans up) a [session](https://help.shapediver.com/doc/sessions) and passes it on to child components using a [context](https://beta.reactjs.org/learn/passing-data-deeply-with-context). 

### `SdViewport`

Creates (and cleans up) a [viewport](https://help.shapediver.com/doc/viewers) and passes it on to child components using a [context](https://beta.reactjs.org/learn/passing-data-deeply-with-context). 

### `SdSessionInteractionData`

Enables selection, hovering, or dragging for nodes of a session's scene tree. 

### `SdViewportInteractionEngine`

Enables selection, hovering, or dragging for a viewport. 

## State management

State management for parameters (and more to come) using [redux](https://redux.js.org/). Provides a link to `SdSession`.
See [`src/app`](src/app) and [`src/features`](src/features).

## UI components

UI components based on [Amplify UI Kit](https://ui.docs.amplify.aws/?platform=react), see [`src/components/ui-kit`](src/components/ui-kit).

:warning: Currently these components depend directly on `SdSession`, this will be refactored such that they depend only on the state management. 

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The project was set up using npm `6.14.15`. 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
