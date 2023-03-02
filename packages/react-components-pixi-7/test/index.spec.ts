import * as index from '../src';

describe('index', () =>
{
    test('export modules for index', () =>
    {
        expect(index).toMatchSnapshot();
    });
});
