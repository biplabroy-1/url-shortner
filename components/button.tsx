"use client";
import { useFormStatus } from "react-dom";

const ButtonComponent = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {pending ? "Shortening..." : "Shorten URL"}
    </button>
  );
};

export default ButtonComponent;
