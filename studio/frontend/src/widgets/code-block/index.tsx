
// This component is a placeholder for a more robust code block with syntax highlighting.
// For the purpose of this demo, it displays code in a simple preformatted block.

'use client';

import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    const { toast } = useToast();
    const [hasCopied, setHasCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(code);
        setHasCopied(true);
        toast({ title: 'Скопировано в буфер обмена' });
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="relative">
            <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={onCopy}
            >
                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Скопировать код</span>
            </Button>
            <pre className="overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm">
                <code className={`language-${language}`}>{code.trim()}</code>
            </pre>
        </div>
    );
}
