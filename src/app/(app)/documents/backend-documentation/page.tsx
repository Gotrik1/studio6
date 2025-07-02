import { promises as fs } from 'fs';
import path from 'path';

export default async function BackendDocumentationPage() {
    const docPath = path.join(process.cwd(), 'src/shared/lib/mock-data/doc-backend.md');
    const markdown = await fs.readFile(docPath, 'utf-8');

    return (
        <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-card p-6 rounded-lg border">{markdown}</pre>
        </div>
    );
}
