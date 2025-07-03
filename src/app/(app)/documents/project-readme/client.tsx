'use client';

import { CodeBlock } from '@/widgets/code-block';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from "next/image";

const MarkdownComponents = {
  // a custom renderer for images to use next/image for optimization
  // and to handle the custom data-ai-hint attribute.
  img: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {node, ...rest} = props;
    return <Image {...rest} alt={props.alt || ''} width={1200} height={630} className="rounded-lg shadow-lg not-prose" data-ai-hint={node.properties['data-ai-hint']} />;
  },
  code({ node, inline, className, children, ...props }: any) {
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
