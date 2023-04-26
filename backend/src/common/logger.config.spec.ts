import {customLogger} from './logger.config';

describe('CustomLogger', () => {
  it('should be defined', () => {
    expect(customLogger).toBeDefined();
  });

  it('should log a message', () => {

    const spy = jest.spyOn(customLogger, 'verbose');
    customLogger.verbose('Test message');
    expect(spy).toHaveBeenCalledWith('Test message');
    spy.mockRestore();
  });
});
