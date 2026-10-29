import {defineConfig} from 'vitest/config';
import path from 'node:path';
export default defineConfig({resolve:{alias:{'@shared/domain':path.resolve('packages/domain/index.ts'),'@shared/documents':path.resolve('packages/documents')}},test:{include:['tests/**/*.test.ts']}});
