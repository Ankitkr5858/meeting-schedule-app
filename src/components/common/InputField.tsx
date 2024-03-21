import React, { InputHTMLAttributes, MouseEventHandler } from "react";
interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  maxLength?: number;
  error?: string;
  className?: string;
  id?: string;
  type?: string;
  isMultiple?: boolean;
  fileType?: string;
  value?: string | number;
  checked?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}
export const InputField: React.FC<IProps> = ({
  label,
  maxLength,
  error,
  className,
  id,
  type,
  isMultiple,
  fileType,
  value,
  checked,
  onChange,
  onClick,
  ...props
}) => {
  return (
    <div className="w-full">
      {type === "checkbox" ? (
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            id={id}
            value={value}
            className={`w-4 h-4 cursor-pointer ${className && className}`}
            checked={checked}
            onClick={onClick}
            onChange={onChange}
            {...props}
          />
          <label className="cursor-pointer" htmlFor={id}>
            {label}
          </label>
        </div>
      ) : type === "file" ? (
        <input
          type="file"
          id={id}
          multiple={isMultiple}
          accept={fileType}
          className={`${className ? className : ""}`}
          {...props}
        />
      ) : (
        <div>
          <input
            onChange={onChange}
            id={id}
            type={type ?? "text"}
            className={`py-2 mb-[0.2rem] px-4 rounded-lg text-black border-gray-300  border w-full focus:outline-none ${className && className
              } ${error && '!bg-red-50 !border-red-500 !text-red-900 !placeholder-red-700 !focus:ring-red-500 !focus:border-red-500'}`}
            maxLength={maxLength}
            value={value}
            placeholder={label}
            {...props}
          ></input>
        </div>
      )}
        <div className={`text-sm text-red-900 ${error ? 'opacity-100' :'opacity-0'}`}>
          <span>{error}</span>
        </div>
    </div>
  );
};
export default InputField;
