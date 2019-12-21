/**
 * Unit tests should be for functions with little to no dependencies
 * Integration tests are for functions that require a lot of mocking of external dependencies
 */

const lib = require('../lib');
const db = require('../db');
/**
 * When I require a module in node, the module is loaded
 * and cached in memory. Therefore, if I require this module 
 * in five different places, all imports refer to the singular 
 * instance in memory. This is why I can mock the functions below.
 */
const mail = require('../mail');

describe('applyDiscount', () => {
  it('should apply 10% discount if customer has more than 10 points', () => {
    // mock function
    db.getCustomerSync = function(id) {
      console.log('fake reading customer');
      return { id, points: 20 };
    }
    const order = { customer: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

/**
 * This is an interaction test
 * It tests the interaction of two (objects) modules - mail and lib
 */
describe('notifyCustomer', () => {
  it('should send an email to the customer', () => {
    db.getCustomerSync = function(id) {
      return { email: 'a', id };
    }

    let mailSent = false;
    mail.send = function(email, message) {
      console.log('fake email sent');
      mailSent = true;
    }

    lib.notifyCustomer({ customerId: 1 });

    expect(mailSent).toBe(true);
  });
});

/**
 * MOCK Functions
 * 
 * This test suite replaces the test suit above
 */
describe('notifyCustomer with mock functions', () => {
  it('should send an email to the customer', () => {

    // const mockFunction = jest.fn();
    // mockFunction.mockReturnValue(1);
    // mockFunction.mockResolvedValue(1);
    // mockFunction.mockRejectedValue(new Error('...error'));
    // const result = await mockFunction();

    db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' }).mockName('cooper mock test');

    mail.send = jest.fn();
    
    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send.mock.calls[0][0]).toBe('a');
    // regex - does arg contain the word 'order'
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    console.log('args: ', mail.send.mock.calls[0])
  });
});