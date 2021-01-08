import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import {render, unmountComponentAtNode } from 'react-dom';
import LogIn from './LogIn';
import fireEvent from '@testing-library/react'

let container = null;

beforeEach(() => {
    // set a DOM elemant as render target
    container = document.createElement('div');
    document.body.appendChild(container);
})

afterEach(() => {
    // clean up on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
})

describe('Log in snapshot test', () => {
    test('test renders as per snapshot', () => {
        const tree = renderer
            .create(<LogIn></LogIn>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("test page renders as epxected when loading", () => {
        const searchInput = queryByLabelText('BrokerId');
    
        render(
          <ApplicationMessages location={{ state: state }}></ApplicationMessages>,
          container
        );

        fireEvent.change(searchInput, { target: { value: 'abcde' }})

        expect(container.innerHTML).toContain("numbers only allowed");
      });
});
