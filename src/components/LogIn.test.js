import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import {render, unmountComponentAtNode } from 'react-dom';
import LogIn from './LogIn';
import {fireEvent, screen, queryByLabelText } from '@testing-library/react'
//import { screen, getByLabelText } from '@testing-library/dom'

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

    // test("test page renders as epxected when invalid text entered too userID field", () => {
    //     const searchInput = screen.queryByLabelText('ColleagueId');
    
    //     render(
    //       <LogIn></LogIn>,
    //       container
    //     );

    //     userEvent.type(screen.queryByLabelText('ColleagueId'), 'abcde')
    //     //expect(screen.getByRole('textbox')).toHaveValue('Hello,\nWorld!')

    //     // fireEvent.change(searchInput, { target: { value: 'abcde' }})
    //      expect(container.innerHTML).toContain("numbers only allowed");
    //   });
});
