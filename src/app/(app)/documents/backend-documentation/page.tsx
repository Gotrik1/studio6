import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function BackendDocumentationPage() {
    const docPath = path.join(process.cwd(), 'src/shared/lib/mock-data/doc-backend.md');
    const markdown = await fs.readFile(docPath, 'utf-8');

    return (
        <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
            </ReactMarkdown>
        </div>
    );
}
