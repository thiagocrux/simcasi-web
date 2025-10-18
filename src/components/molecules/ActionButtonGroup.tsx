import { UserRoundPen, UserRoundSearch, UserRoundX } from 'lucide-react';

interface ActionButtonGroupProps {
  redirect?: {
    action: () => void;
    isDisabled?: boolean;
  };
  edit?: {
    action: () => void;
    isDisabled?: boolean;
  };
  remove?: {
    action: () => void;
    isDisabled?: boolean;
  };
  // TODO: Implement button sizes with labels or not
}

export default function ActionButtonGroup({
  redirect,
  edit,
  remove,
}: ActionButtonGroupProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {redirect ? (
          <button
            className="border-border hover:bg-surface cursor-pointer rounded-md border-1 p-2"
            onClick={redirect.action}
          >
            <UserRoundSearch size={18} />
          </button>
        ) : null}

        {edit ? (
          <button
            className="border-border hover:bg-surface cursor-pointer rounded-md border-1 p-2"
            onClick={edit.action}
          >
            <UserRoundPen size={18} />
          </button>
        ) : null}

        {remove ? (
          <button
            className="border-border bg-error hover:bg-error/80 cursor-pointer rounded-md border-1 p-2"
            onClick={remove.action}
            disabled={remove.isDisabled}
          >
            <UserRoundX size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
