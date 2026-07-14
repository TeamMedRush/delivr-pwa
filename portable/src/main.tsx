import { render } from 'preact';

import { IndexPage } from '@routes/index';

function App() {
  return <IndexPage />;
}

const appDiv = document.getElementById('app')!;
render(<App />, appDiv);
appDiv.focus();

