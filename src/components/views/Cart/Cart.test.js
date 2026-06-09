import React from 'react';
import { shallow } from 'enzyme';
import { CartComponent } from './Cart';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component CartComponent', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <CartComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});












