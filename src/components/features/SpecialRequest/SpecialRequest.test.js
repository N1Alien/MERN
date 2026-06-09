import React from 'react';
import { shallow } from 'enzyme';
import SpecialRequest from './SpecialRequest';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component SpecialRequest', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <SpecialRequest />
        </Provider>
      )
    ).toBeTruthy();
  });
});
