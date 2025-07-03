'use client';

import { CodeBlock } from '@/widgets/code-block';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from "next/image";
import type { Components } from 'react-markdown';

const MarkdownComponents: Components = {
  // a custom renderer for images to use next/image for optimization
  // and to handle the custom data-ai-hint attribute.
  img: (props) => {
    const { node, src, ...rest } = props;
    if (!src) return null;
    const dataAiHint = node?.properties?.['data-ai-hint'] as string | undefined;

    return <Image src={src} {...rest} alt={rest.alt || ''} width={1200} height={630} className="rounded-lg shadow-lg not-prose" data-ai-hint={dataAiHint} />;
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
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

export default function ProjectReadmeClient({ markdown }: { markdown: string }) {
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
