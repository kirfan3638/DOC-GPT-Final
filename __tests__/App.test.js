import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('logs in with valid credentials and shows note entry screen', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'doctor@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'secure123');

    fireEvent.press(getByText('Login'));

    expect(queryByText('Enter Patient Note')).toBeTruthy();
    expect(getByText('Save Note')).toBeTruthy();
  });
});
