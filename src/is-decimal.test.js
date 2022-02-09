//
// Copyright (c) DITUS INC. All rights reserved. See LICENSE file in the project
// root for details.
//
import * as Yup from 'yup';
import './is-decimal';

describe('isDecimal', () => {
  it('returns a range error if the whole number is less than zero.', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(-1, 4, 'error message'); }).toThrowError(RangeError);
    expect(() => { schema.isDecimal(-1, 4, 'error message'); }).toThrowError('The whole argument cannot be less than zero.');
  });

  it('does not return an error if the whole number is greater than or equal to zero.', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(0, 4, 'error message'); }).not.toThrowError();
    expect(() => { schema.isDecimal(1, 4, 'error message'); }).not.toThrowError();
  });

  it('returns a range error if the fraction number is less than zero.', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(1, -1, 'error message'); }).toThrowError(RangeError);
    expect(() => { schema.isDecimal(1, -1, 'error message'); }).toThrowError('The fraction argument cannot be less than zero.');
  });

  it('does not return an error if the fraction number is greater than or equal to zero.', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(1, 0, 'error message'); }).not.toThrowError();
    expect(() => { schema.isDecimal(1, 1, 'error message'); }).not.toThrowError();
  });

  it('returns a range error if the whole and fraction number is greater than 16 digits (not including the period).', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(16, 1, 'error message'); }).toThrowError(RangeError);
    expect(() => { schema.isDecimal(16, 1, 'error message'); }).toThrowError('The whole and fraction arguments combined cannot be greater than the maximum supported by JavaScript.');
  });

  it('does not return an error if the whole and fraction number is equal to 16 digits (not including the period).', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(10, 6, 'error message'); }).not.toThrowError();
  });

  it('does not return an error if the whole and fraction number is less than 16 digits (not including the period).', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(3, 4, 'error message'); }).not.toThrowError();
  });

  it('returns a range error if the whole and fraction number are both zero.', () => {
    const schema = Yup.number();

    expect(() => { schema.isDecimal(0, 0, 'error message'); }).toThrowError(RangeError);
    expect(() => { schema.isDecimal(0, 0, 'error message'); }).toThrowError('The whole and fraction arguments cannot both be zero.');
  });

  it('returns success if the number does not exceed the whole number digits.', async () => {
    const schema = Yup.number();

    await expect(schema.isDecimal(3, 0, 'error message').validate(123)).resolves.toBe(123);
  });

  it('does not return success if the number exceeds the whole number digits.', async () => {
    const schema = Yup.number();

    await expect(schema.isDecimal(3, 0, 'error message').validate(1234)).rejects.toThrow('error message');
  });

  it('returns success if the number does not exceed the fraction number digits.', async () => {
    const schema = Yup.number();

    await expect(schema.isDecimal(0, 3, 'error message').validate(0.123)).resolves.toBe(0.123);
  });

  it('does not return success if the number exceeds the fraction number digits.', async () => {
    const schema = Yup.number();

    await expect(schema.isDecimal(0, 3, 'error message').validate(0.1234)).rejects.toThrow('error message');
  });

  it('returns success if the number does not exceed both the whole and fraction number digits.', async () => {
    const schema = Yup.number();

    await expect(schema.isDecimal(2, 3, 'error message').validate(12.123)).resolves.toBe(12.123);
  });

  it('does not return success if the number exceeds both the whole and fraction number digits.', async () => {
    const schema = Yup.number();

    await expect(schema.isDecimal(2, 3, 'error message').validate(123.1234)).rejects.toThrow('error message');
  });

  it('does not round the result in a large number.', async () => {
    const schema = Yup.number();

    await expect(schema.isDecimal(10, 6, 'error message').validate(9999999999.999999)).resolves.toBe(9999999999.999999);
  });
});
