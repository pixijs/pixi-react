import * as index from '../src';
import * as reactSpring from '../src/index-animated';

describe('index', () =>
{
    test('export modules for index', () =>
    {
        expect(index).toMatchSnapshot();
    });

    test('export modules for react-spring', () =>
    {
        expect(reactSpring).toMatchSnapshot();
    });
});
