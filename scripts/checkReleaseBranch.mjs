#!/usr/bin/env node
import process from 'node:process';
import { execSync } from 'child_process';

const RELEASE_BRANCH = 'master';
const CONSOLE_COLOR_RED = '\x1b[31m';
const CONSOLE_COLOR_RESET = '\x1b[0m';

const status = execSync('git status', { encoding: 'utf-8' });

const res = status.match(/on branch (.+)\n/i);
const currentBranch = res?.[1];

if (currentBranch !== RELEASE_BRANCH)
{
    const messageParts = [
        CONSOLE_COLOR_RED,
        `You are on the "${currentBranch}" branch and not the release branch: "${RELEASE_BRANCH}"!`,
        CONSOLE_COLOR_RESET,
    ];

    console.error(messageParts.join(''));
    process.exit(1);
}

process.exit(0);
