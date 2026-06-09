import React from 'react';
import { shallow } from 'enzyme';
import { ProductComponent } from './Product';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component Product', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <ProductComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});