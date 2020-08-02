import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import App from './App';

test('Check that images are shown after keyword', () => {
    const utils = render(<App />);
    const inputElement = utils.getByPlaceholderText('Keyword');
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, {target: {value: 'card'}});
    expect(inputElement.value).toBe('card');
    const submitButtonElement = utils.getByText('Start Game!');
    expect(submitButtonElement).toBeInTheDocument();
    submitButtonElement.click();
    setTimeout(()=>{
        for(let i = 0; i < 20; i++){
            const imageElement = utils.getByTestId(i);
            expect(imageElement).toBeInTheDocument();
        }
    }, 1000)
})
