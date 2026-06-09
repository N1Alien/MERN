import React from 'react';
import { shallow } from 'enzyme';
import Carusel from './Carusel';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
describe('Component Carusel', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <Carusel />
        </Provider>
      )
    ).toBeTruthy();
  });
});
