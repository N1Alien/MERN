import React from 'react';
import { shallow } from 'enzyme';
import { SearchBarComponent } from './SearchBar';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

describe('Component SearchBar', () => {
  it('should render without crashing', () => {
    expect(
      shallow(
        <Provider store={store}>
          <SearchBarComponent />
        </Provider>
      )
    ).toBeTruthy();
  });
});
