import { cleanup } from '@testing-library/react';
import ReactDOM from 'react-dom'
import App from './App';

afterEach(cleanup);
test('App renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div);
});