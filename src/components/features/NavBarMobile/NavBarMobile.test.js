import React from 'react';
import { shallow } from 'enzyme';
import { NavBarMobileComponent } from './NavBarMobile';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component NavBarMobile', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <NavBarMobileComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});
