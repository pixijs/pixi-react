import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
    cleanup,
    configure,
} from '@testing-library/react';

configure({ reactStrictMode: true });

afterEach(() => cleanup());
