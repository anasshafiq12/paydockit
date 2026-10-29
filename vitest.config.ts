import {defineConfig} from 'vitest/config';
import path from 'node:path';
export default defineConfig({resolve:{alias:{'@shared/domain':path.resolve('packages/domain/index.ts')}},test:{include:['tests/**/*.test.ts']}});
