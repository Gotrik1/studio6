import { promises as fs } from 'fs';
import path from 'path';
import BackendDocumentationClient from './client';

export default async function BackendDocumentationPage() {
    const docPath = path.join(process.cwd(), 'BACKEND_DOCUMENTATION.md');
    const markdown = await fs.readFile(docPath, 'utf-8');

    return <BackendDocumentationClient markdown={markdown} />;
}
