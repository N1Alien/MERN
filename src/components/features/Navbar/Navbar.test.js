import React from 'react';
import { shallow } from 'enzyme';
import { NavbarComponent } from './Navbar';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component Navbar', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <NavbarComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});
