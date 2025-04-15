import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import {
  Copy,
  Plus,
  SquareChevronRight,
  SquareDashedBottomCode,
  SquareTerminal,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function BentoApiAccess() {
  const copy = useCopyToClipboard();
  const [tokenName, setTokenName] = useState('');
  const [apiTokens, setApiTokens] = useState(['Staging ENV']);

  const createApiToken = () => {
    if (tokenName.trim() === '') return;
    setApiTokens([...apiTokens, tokenName]);
    setTokenName('');
    toast.success(`Token ${tokenName} created.`);
  };

  async function copyToken(token: string) {
    const msgBuffer = new TextEncoder().encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    copy(hashHex)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-2 flex justify-between">
          <Input
            className="mr-3"
            placeholder="Token Name"
            autoComplete="off"
            value={tokenName}
            disabled={apiTokens.length >= 3}
            onChange={(e) => setTokenName(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={createApiToken}
            disabled={apiTokens.length >= 3}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="divide-y">
          {apiTokens.map((token, i) => (
            <div
              key={i}
              className="flex w-full items-center justify-start"
            >
              <div className="min-w-8">
                <div className="inline-flex size-7 items-center justify-center rounded-md border">
                  {i === 0 && <SquareChevronRight className="size-3.5" />}
                  {i === 1 && <SquareTerminal className="size-3.5" />}
                  {i === 2 && <SquareDashedBottomCode className="size-3.5" />}
                </div>
              </div>
              <div className="flex w-full justify-between">
                <h1 className="h-10 truncate overflow-hidden pt-3 pl-1 text-xs font-medium text-ellipsis whitespace-nowrap">
                  {token}
                </h1>
                <Button
                  variant="ghost"
                  size={'sm'}
                  className="mt-1 hover:cursor-pointer"
                  onClick={() => copyToken(token)}
                >
                  <Copy className="size-3" />
                </Button>
              </div>
            </div>
          ))}
          <div className="border" />
        </div>
      </div>
    </>
  );
}
