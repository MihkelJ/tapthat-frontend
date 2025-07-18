import ReactDOM from 'react-dom/client';

import { AppProviders } from './providers/AppProviders';
import './styles.css';

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AppProviders />);
}
