import React, { useEffect } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import Tippy from "@tippyjs/react";
// import { Public_Image_URL } from "../../../../Main/Data/Dummy";

interface ReadOnlyRowProps {
  data: Record<string, any>;
  handleEditClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
    data: Record<string, any>
  ) => void;
  handleDeleteClick?: (id: number) => void;
  editableRow?: boolean;
  onClickRow?: (data: Record<string, any>) => void;
}

const ReadOnlyRow: React.FC<ReadOnlyRowProps> = ({
  data,
  handleEditClick,
  handleDeleteClick,
  editableRow = false,
  onClickRow = () => {},
}) => {
  useEffect(() => {}, [data]);

  const Fields = Object.entries(data)
    .filter(([key]) => key !== "id")
    .map(([key, value]) =>
      key === "عکس" || key === "picture" || key === "avatar" ? (
        <td key={key}>
          <img
            src={`${value}`}
            alt="avatar"
            className="rounded-full w-11 h-11 mx-auto"
          />
        </td>
      ) : (
        <td key={key} dir="ltr">
          {value}
        </td>
      )
    );

  const handleRowClick = () => {
    onClickRow && onClickRow(data);
  };

  return (
    <tr >
    <>
      {Fields}
      {editableRow && (
        <td className="Last-col" dir="ltr" >
          <Tippy content="ویرایش">
            <button
              type="button"
              className="bg-transparent text-green-500"
              onClick={(event) => handleEditClick(event, data)}
            >
              <BiEdit className="w-6 h-6 mx-auto" />
            </button>
          </Tippy>
          <Tippy content="حذف">
            <button
              type="button"
              className="bg-transparent text-red-500"
              onClick={() => handleDeleteClick(data.id)}
            >
              <RiDeleteBin7Line className="w-6 h-6 mx-auto" />
            </button>
          </Tippy>
        </td>
      )}
      </>
    </tr>
  );
};

export default ReadOnlyRow;
