import { days } from "@/app/signup/utils";
import { IDays, IUser, IUserAvailabilityResponse } from "@/types";
import { convertMinutesToTime } from "@/utils/convertMinutesToTime";
import { useState, useEffect, useRef } from "react";

interface CustomSelectProps {
  label: string;
  options: (IUser | IUserAvailabilityResponse | IDays)[];
  isDay?: boolean;
  optionLabel?: string;
  optionLabel2?: string;
  isLoading?: boolean;
  optionsWidth?: string;
  className?: string;
  onChange: (selectedValues: any[]) => void;
  selectedValues?: string[];
  singleSelect?: boolean;
  openOnTop?: string;
  selectorWidth?: string;
}

export default function CustomSelect({
  label,
  isLoading,
  options,
  isDay = false,
  optionLabel,
  optionLabel2,
  onChange,
  className,
  optionsWidth,
  selectedValues = [],
  singleSelect = false,
  openOnTop,
  selectorWidth,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>(selectedValues);
  const customSelectRef = useRef<HTMLDivElement | null>(null);
  function updateSelectedItems(params: any[]) {
    setSelectedItems(params);
    onChange(params);
  }
  // useEffect(() => {
  //   setSelectedItems([...selectedValues]);
  // }, [selectedValues]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (
    option: IUser | IUserAvailabilityResponse | IDays
  ) => {
    if (singleSelect) {
      updateSelectedItems([option]);
      setIsOpen(false); // Close the dropdown after selecting in single-select mode
    } else {
      const isSelected = selectedItems
        .map((item) => item.id)
        .includes(option.id);
      const updatedSelection = isSelected
        ? selectedItems.filter((item) => item.id !== option.id)
        : [...selectedItems, option];
      updateSelectedItems(updatedSelection);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        customSelectRef.current &&
        !customSelectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Add the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={customSelectRef}
      className={`relative inline-block text-left ${className}`}
    >
      <div>
        <button
          className={`flex items-center justify-between w-[170px]  rounded-lg border border-gray-300
           bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300
            focus:outline-none focus:ring focus:ring-blue-200 z-[50] ${
              selectorWidth ? `${selectorWidth}` : ""
            } ${className}`}
          onClick={toggleDropdown}
        >
          <div className="flex flex-wrap">
            {selectedItems.length === 0
              ? label
              : selectedItems.map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-center text-ellipsis whitespace-nowrap overflow-hidden w-36 ${optionsWidth}`}
                  >
                    {optionLabel && optionLabel2
                      ? `${
                          !isDay
                            ? convertMinutesToTime(item[optionLabel])
                            : days[item[optionLabel]]?.name
                        } - ${
                          !isDay
                            ? convertMinutesToTime(item[optionLabel2])
                            : days[item[optionLabel2]]?.name
                        }`
                      : optionLabel
                      ? item[optionLabel]
                      : item.name}
                    <span
                      className="text-red-600 cursor-pointer ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick(item);
                      }}
                    >
                      {singleSelect ? (
                        ""
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.293 5.293a1 1 0 011.414 0L11.414 12l4.293 4.293a1 1 0 11-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 12 4.293 7.707a1 1 0 111.414-1.414L10 10.586l4.293-4.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    {index !== selectedItems.length - 1 && ", "}
                  </div>
                ))}
          </div>
          <span>
            {!isLoading ? (
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <div className="flex items-center justify-center">
                <div role="status" className="flex justify-center">
                  <svg
                    aria-hidden="true"
                    className={`w-5 h-5 text-gray-200 animate-spin dark:text-white fill-primary`}
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </span>
        </button>
      </div>

      {isOpen && (
        <div
          className={`origin-top-right w-[240px] max-h-48 min-h-12 overflow-auto${
            selectorWidth ? `${selectorWidth}` : ""
          } absolute right-0 mt-2 
         rounded-md  shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[50] ${
           openOnTop ? `${openOnTop}` : ""
         } ${className}`}
        >
          {!isLoading ? (
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.length ? (
                options.map((option :any) => (
                  <div
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className={`${
                      selectedItems.map((items) => items.id).includes(option.id)
                        ? "bg-blue-300 text-blue-600"
                        : "hover:dark:bg-gray-100 hover:dark:text-gray-900"
                    } text-white dark:text-black  cursor-pointer select-none relative px-4 py-2 z-[50]`}
                    role="menuitem"
                  >
                     {(optionLabel && optionLabel2) ? `${!isDay ? convertMinutesToTime(option[optionLabel]) : days[option[optionLabel]].name} - ${!isDay ? convertMinutesToTime(option[optionLabel2]) : days[option[optionLabel2]].name}` : (optionLabel) ? convertMinutesToTime(option[optionLabel]) : option.name}
                  </div>
                ))
              ) : (
                <div className="text-center text-black py-4">No Record</div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div role="status" className="flex justify-center">
                <svg
                  aria-hidden="true"
                  className={`w-10 h-10 text-gray-200 animate-spin dark:text-white fill-primary`}
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
