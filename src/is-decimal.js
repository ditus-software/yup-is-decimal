//
// Copyright (c) DITUS INC. All rights reserved. See LICENSE file in the project
// root for details.
//
import * as Yup from 'yup';

/**
 * Checks that a value is valid decimal number.
 *
 * @param {number} whole The number of digits to the left of the decimal point.
 * @param {number} fraction The number of digits to the right of the decimal
 * point.
 * @param {string} message The message to display if the value is not a valid
 * decimal number.
 * @returns {Promise} A promise that resolves or rejects.
 */
function isDecimal(whole, fraction, message) {
  if (whole < 0) {
    throw new RangeError('The whole argument cannot be less than zero.');
  }

  if (fraction < 0) {
    throw new RangeError('The fraction argument cannot be less than zero.');
  }

  if (fraction === 0 && whole === 0) {
    throw new RangeError('The whole and fraction arguments cannot both be zero.');
  }

  // JavaScript Number type cannot support a combined length greater than
  // 16-digits, otherwise, it will truncate or round.
  //
  // https://stackoverflow.com/questions/54800022/
  // why-max-digits-with-decimal-in-javascript-are-only-16
  if (whole + fraction > 16) {
    throw new RangeError('The whole and fraction arguments combined cannot be greater than the maximum supported by JavaScript.');
  }

  // The replace statement below is needed. If no whole number portion is
  // specified (i.e. .123), JavaScript will automatically add 0. In this
  // example, 0.123. The replace statement will remove any leading zero.
  //
  // Also, if there is no value entered in the field, then this method must
  // return true, otherwise, it is impossible to make a field optional that uses
  // this rule.
  return this.test(
    'is-decimal',
    message,
    (value) => (value ?? '') === '' || ''.concat(value).replace(/^0+/, '').match(`^\\d{0,${whole}}(\\.{1}\\d{0,${fraction}}){0,1}$`),
  );
}

Yup.addMethod(Yup.number, 'isDecimal', isDecimal);
