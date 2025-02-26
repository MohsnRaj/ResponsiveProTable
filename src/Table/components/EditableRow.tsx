import React from "react";
import Tippy from "@tippyjs/react";
import { AiOutlineSave } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

interface EditableRowProps {
  editFormData: Record<string, any>;
  handleEditFormChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancelClick: () => void;
  inputName: string[];
  Types: Record<string, string>;
}

const EditableRow: React.FC<EditableRowProps> = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  inputName,
  Types,
}) => {
  const inputFields = Object.keys(Types).map((key, index) => {
    if (key === "عکس" || key === "picture") {
      return (
        <td key={key} dir="ltr">
          <input
            type={Types[key]}
            name={inputName[index]}
            accept=".jpg,.png,.jpeg"
            onChange={handleEditFormChange}
          />
        </td>
      );
    } else {
      // Ensure we have a string to calculate length
      const valueStr = editFormData[key] ? editFormData[key].toString() : "";
      return (
        <td key={key} dir="ltr">
          <input
            type={Types[key]}
            name={inputName[index]}
            value={editFormData[key]}
            onChange={handleEditFormChange}
            // Add extra characters (e.g. +2) for padding
            style={{ width: `${(valueStr.length || 1) + 2}ch` }}
            className="border-2 border-gray-500 rounded-md px-2"
          />
        </td>
      );
    }
  });

  return (
    <tr className="text-slate-600">
      {inputFields}
      <td className="Last-col">
        <Tippy content="ذخیره">
          <button type="submit" className="bg-transparent text-green-500">
            <AiOutlineSave className="w-5 h-5" />
          </button>
        </Tippy>
        <Tippy content="لغو عملیات">
          <button type="button" className="bg-transparent text-red-500" onClick={handleCancelClick}>
            <MdOutlineCancel className="w-5 h-5" />
          </button>
        </Tippy>
      </td>
    </tr>
  );
};

export default EditableRow;
