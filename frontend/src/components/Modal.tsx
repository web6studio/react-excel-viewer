import { ReactNode, MouseEvent } from "react";
import { X } from "lucide-react";

type Props = {
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export const Modal = ({ title, children, onClose }: Props) => {
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm z-40 flex items-center justify-center p-0 md:p-4"
    >
      <div className="relative w-full max-w-6xl h-[100vh] md:h-[90vh] bg-white md:rounded-xl shadow-2xl p-8 overflow-hidden">
        <div className="flex items-center justify-center relative mb-4">
          {title && (
            <h2 className="text-3xl font-semibold text-gray-800 text-center w-full pr-8">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-700 hover:text-gray-800 cursor-pointer"
          >
            <X size={32} />
          </button>
        </div>

        <div className="h-full overflow-auto pt-2">{children}</div>
      </div>
    </div>
  );
};
