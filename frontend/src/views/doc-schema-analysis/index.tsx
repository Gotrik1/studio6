import { promises as fs } from 'fs';
import path from 'path';
import SchemaAnalysisClient from './client';

export async function SchemaAnalysisPage() {
    const docPath = path.join(process.cwd(), 'src/shared/lib/mock-data/doc-schema-analysis.md');
    const markdown = await fs.readFile(docPath, 'utf-8');

    return <SchemaAnalysisClient markdown={markdown} />;
}
