interface InputErrorMessageInterface {
  id: string;
  message?: string;
}

export default function InputErrorMessage({
  id,
  message,
}: InputErrorMessageInterface) {
  if (!message) {
    return null;
  }

  return (
    <span id={id} className="text-error flex gap-x-2">
      {message}
    </span>
  );
}
