import * as index from '../src';

describe('index', () =>
{
    test('export modules for react-animated', () =>
    {
        expect(index).toMatchSnapshot();
    });
});
