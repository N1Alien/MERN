import React from 'react';
import { shallow } from 'enzyme';
import { SplashComponent } from './Splash';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component Splash', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <SplashComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});
