import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import {render, unmountComponentAtNode } from 'react-dom';
import Footer from './Footer';

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

describe('Footer tests', () => {
    test('test renders as per snapshot', () => {
        const tree = renderer
            .create(<Footer ></Footer>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});