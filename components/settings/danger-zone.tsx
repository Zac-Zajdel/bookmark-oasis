import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionHeader } from '@/components/ui/section-header';
import { Handshake, Trash } from 'lucide-react';
import { useState } from 'react';

export default function DangerZone() {
  const [promptToDelete, setPromptToDelete] = useState('');

  const handleDeleteAccount = async () => {
    console.log(promptToDelete);
  };

  return (
    <>
      <SectionHeader
        title="Danger Zone"
        description="Delete your account and be forever lost in a sea of unorganized links... "
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Trash className="mr-2 size-4" />
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription className="pt-2">
              This action cannot be undone. This will permanently delete your
              account and data. Thanks for using Bookmark Oasis!
            </DialogDescription>
          </DialogHeader>
          <div className="my-5 flex flex-col gap-3">
            <Label htmlFor="name">
              To delete, type <b>Delete My Account</b> below
            </Label>
            <Input
              id="name"
              value={promptToDelete}
              className="col-span-3"
              onChange={(e) => setPromptToDelete(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              type="submit"
              disabled={promptToDelete !== 'Delete My Account'}
              onClick={handleDeleteAccount}
            >
              <Handshake className="mr-2 size-4" />
              Goodbye
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
