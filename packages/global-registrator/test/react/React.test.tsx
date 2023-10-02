import GlobalRegistrator from '../../cjs/GlobalRegistrator.cjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactComponent from './ReactComponent.js';

const selfReferringProperties = ['self', 'top', 'parent', 'window'];

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const originalSetTimeout = global.setTimeout;

GlobalRegistrator.register();

const appElement = document.createElement('app');
let root;
document.body.appendChild(appElement);

function mountReactComponent(): void {
	root = ReactDOM.createRoot(appElement);
	root.render(<ReactComponent />);

	if (appElement.innerHTML !== '<div>Test</div>') {
		throw Error('React not rendered correctly.');
	}
}

function unmountReactComponent(): void {
	root.unmount();

	if (appElement.innerHTML !== '') {
		throw Error('React not unmounted correctly.');
	}
}

if (global.setTimeout === originalSetTimeout) {
	throw Error('Happy DOM function not registered.');
}

for (const property of selfReferringProperties) {
	if (global[property] !== global) {
		throw Error('Self referring property property was not registered.');
	}
}

mountReactComponent();
unmountReactComponent();

GlobalRegistrator.unregister();

if (global.setTimeout !== originalSetTimeout) {
	throw Error('Global property was not restored.');
}
