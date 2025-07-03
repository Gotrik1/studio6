import { promises as fs } from 'fs';
import path from 'path';
import AdrClient from './client';
import { notFound } from 'next/navigation';

export default async function AdrPage({ params }: { params: { slug: string } }) {
    const docPath = path.join(process.cwd(), 'src/shared/lib/mock-data/adr', `${params.slug}.md`);
    
    try {
        const markdown = await fs.readFile(docPath, 'utf-8');
        return <AdrClient markdown={markdown} />;
    } catch {
        notFound();
    }
}
