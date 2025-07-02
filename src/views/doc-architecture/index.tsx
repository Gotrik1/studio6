
import { promises as fs } from 'fs';
import path from 'path';
import ArchitectureClient from '@/app/(app)/documents/architecture/client';

export async function ArchitecturePage() {
    const docPath = path.join(process.cwd(), 'src/shared/lib/mock-data/doc-architecture.md');
    const markdown = await fs.readFile(docPath, 'utf-8');

    return <ArchitectureClient markdown={markdown} />;
}
