import React from 'react';
import { shallow } from 'enzyme';
import { AmountWidgetComponent } from './AmountWidget';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

  
describe('Component AmountWidget', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <AmountWidgetComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});
