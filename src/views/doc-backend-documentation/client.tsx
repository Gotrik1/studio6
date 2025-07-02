'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/widgets/code-block';
import { cn } from '@/shared/lib/utils';

export function BackendDocumentationClient({ markdown }: { markdown: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none opacity-0 animate-fade-in-up">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ node, ...props }) => (
            <div className="not-prose my-6">
              <pre {...props} />
            </div>
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <CodeBlock
                code={String(children).replace(/\n$/, '')}
                language={match[1]}
              />
            ) : (
              <code
                className={cn('before:content-none after:content-none', className)}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}