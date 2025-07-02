
'use client';

import { CodeBlock } from '@/widgets/code-block';
import ReactMarkdown from 'react-markdown';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import remarkGfm from 'remark-gfm';

const MarkdownComponents = {
  code({ node, inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeBlock
        language={match[1]}
        code={String(children).replace(/\n$/, '')}
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export default function ArchitectureClient({ markdown }: { markdown: string }) {
    return (
        <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    );
}
