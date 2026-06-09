import React from 'react';
import { shallow } from 'enzyme';
import { OrderComponent } from './Order';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component AmountWidget', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <OrderComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});




 