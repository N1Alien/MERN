import React from 'react';
import { shallow } from 'enzyme';
import { HeaderComponent } from './Header';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component Header', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <HeaderComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});
