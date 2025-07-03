'use client';

import { CodeBlock } from '@/widgets/code-block';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const MarkdownComponents: Components = {
  code(props) {
    const { className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <CodeBlock
        language={match[1]}
        code={String(children).replace(/\n$/, '')}
      />
    ) : (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
};

export default function BackendDocumentationClient({ markdown }: { markdown: string }) {
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
