import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import {render, unmountComponentAtNode } from 'react-dom';
import Header from './Header';

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

describe('Header tests', () => {
    test('test renders as per snapshot', () => {
        const tree = renderer
            .create(<Header ></Header>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});