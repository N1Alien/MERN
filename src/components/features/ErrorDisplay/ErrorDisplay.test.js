import React from 'react';
import { shallow } from 'enzyme';
import ErrorDisplay from './ErrorDisplay';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component ErrorDisplay', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <ErrorDisplay />
        </Provider>
      )
    ).toBeTruthy();
  });
});
