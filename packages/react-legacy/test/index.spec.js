import * as index from '../src/index';

describe('index', () =>
{
    test('export modules for index legacy', () =>
    {
        expect(index).toMatchSnapshot();
    });
});
