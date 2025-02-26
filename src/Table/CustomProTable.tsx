import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
  FormEvent,
} from "react";
import "./App.css";
import {
  RiFileExcel2Line,
  RiSortAsc,
  RiSortDesc,
  RiArrowRightLine,
  RiArrowLeftLine,
} from "react-icons/ri";
import { utils, writeFile } from "xlsx";
import jalaliday from "jalaliday";
import dayjs from "dayjs";
import EditableRow from "./components/EditableRow";
import Tippy from "@tippyjs/react";

dayjs.extend(jalaliday);

interface NestedChildProps {
  data: unknown;
  handleEditClick?: () => void;
}
interface OuterChildProps {
  children: React.ReactElement<NestedChildProps>;
}

interface DataItem {
  [key: string]: any;
  id: number | string;
}

interface Headcol {
  [key: string]: any;
}

interface ColType {
  [key: string]: string;
}

interface SortConfig {
  key: string | null;
  direction: "asc" | "desc" | null;
  mode: number; // 0,1,2
}

interface CustomProTableProps {
  headcol: Headcol;
  colType: ColType;
  data: DataItem[];
  editableRow?: boolean;
  onClickRow?: () => void;
  ExcelExport?: boolean;
  children?: ReactNode;
  compareProperty?: string;
  handleDeleteClick?: ((id: number | string) => void) | null;
  handleSubmit?: (
    id: number | string,
    tableEl: HTMLFormElement | null
  ) => Promise<boolean>;
  inputName?: string[];
}

function getObjectKeysToList(obj: Record<string, any>): string[] {
  return Object.keys(obj);
}

const CustomProTable: React.FC<CustomProTableProps> = ({
  headcol,
  colType,
  data,
  editableRow = true,
  onClickRow = false,
  ExcelExport = false,
  children,
  compareProperty,
  handleDeleteClick = null,
  handleSubmit,
  inputName = getObjectKeysToList(colType),
}) => {
  const table = useRef<HTMLFormElement>(null);
  const [DataList, setDataList] = useState<DataItem[]>(data);
  const Direction = "rtl";

  const [editFormData, setEditFormData] = useState<Headcol>(headcol);
  const [editContactId, setEditContactId] = useState<number | string | null>(
    null
  );

  // --- SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- NEW: Container ref for horizontal scrolling ---
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDataList(data);
  }, [data]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
    mode: 0,
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Determine if arrow buttons should be shown
  const showArrowButtons = windowWidth < 1100 || Object.keys(headcol).length > 7;
  const handleSort = (key: string) => {
    let mode = sortConfig.mode;
    if (mode < 2) {
      mode++;
    } else {
      mode = 0;
    }
    const direction = mode > 0 ? (mode === 1 ? "asc" : "desc") : null;
    setSortConfig({ key, direction, mode });
  };

  // --- FILTER THE DATA BASED ON THE SEARCH TERM ---
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return DataList;
    }
    return DataList.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [DataList, searchTerm]);

  // --- THEN SORT THE FILTERED DATA ---
  const sortedData = useMemo(() => {
    const sortedArray = [...filteredData];
    if (sortConfig.key && sortConfig.direction) {
      sortedArray.sort((a, b) => {
        const aVal = a[sortConfig.key as string];
        const bVal = b[sortConfig.key as string];
        if (typeof aVal === "string") {
          return aVal.localeCompare(bVal);
        }
        return aVal - bVal;
      });
      if (sortConfig.direction === "desc") {
        sortedArray.reverse();
      }
    }
    return sortedArray;
  }, [filteredData, sortConfig]);

  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    if (!fieldName) return;

    const fieldValue =
      fieldName === "عکس" && event.target.files
        ? URL.createObjectURL(event.target.files[0])
        : event.target.value;

    setEditFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleEditFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (editContactId === null) return;
    try {
      const state = await handleSubmit?.(editContactId, table.current);
      if (state) {
        setEditContactId(null);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowData: DataItem
  ) => {
    event.preventDefault();
    setEditContactId(rowData.id);
    setEditFormData({
      ...rowData,
    });
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  function convertToSheetData(tableData: DataItem[]): any[][] {
    if (tableData.length === 0) return [];
    const headers = Object.keys(tableData[0]);
    const dataArray = tableData.map((item) => Object.values(item));
    dataArray.unshift(headers);
    return dataArray;
  }

  function exportToExcel(tableData: DataItem[]) {
    const sheetData = convertToSheetData(tableData);
    const worksheet = utils.aoa_to_sheet(sheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Table Data");

    const fileName = `table-data-${dayjs()
      .calendar("jalali")
      .locale("fa")
      .format("dddd, MMMM D, YYYY")}.xlsx`;
    writeFile(workbook, fileName);
  }

  function handleClick() {
    const tableData = [...DataList];
    exportToExcel(tableData);
  }

  const scrollToRight = () => {
    if (tableContainerRef.current) {
      // In RTL, scrollLeft = 0 shows the rightmost side.
      tableContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToLeft = () => {
    if (tableContainerRef.current) {
      console.log("scrollWidth: ", tableContainerRef.current.scrollWidth);
      console.log("scrollWidth: ", tableContainerRef.current.clientWidth);
      tableContainerRef.current.scrollTo({
        left:
          tableContainerRef.current.clientWidth -
          tableContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Toolbar with Excel export button and search input */}
      <div className="p-3 w-full flex justify-between items-center">
        {ExcelExport && (
          <Tippy content="خروجی اکسل">
            <button onClick={handleClick} className="ml-2">
              <RiFileExcel2Line className="text-red-500 w-6 h-6 transition-all duration-150 ease-in-out hover:scale-110" />
            </button>
          </Tippy>
        )}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجو..."
          className="SearchInput"
        />
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="MyCustomTable" dir={Direction} ref={tableContainerRef}>
        <table>
          <thead>
            <tr>
              {Object.keys(headcol).map((key) =>
                key !== "عکس" ? (
                  <th key={key} onClick={() => handleSort(key)}>
                    <span>{key}</span>
                    <span className="w-fit">
                      {sortConfig.key === key &&
                        sortConfig.direction === "asc" && (
                          <RiSortAsc className="w-fit inline-block" />
                        )}
                      {sortConfig.key === key &&
                        sortConfig.direction === "desc" && (
                          <RiSortDesc className="w-fit inline-block" />
                        )}
                    </span>
                  </th>
                ) : (
                  <th key={key}>{key}</th>
                )
              )}
              {editableRow && <th className="fixed-column">ویرایش</th>}
            </tr>
          </thead>
          <tbody className="scrollable">
            {sortedData.length ? (
              sortedData.map((row, index) => (
                <React.Fragment key={index}>
                  {editContactId === row.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormChange={handleEditFormChange}
                      handleCancelClick={handleCancelClick}
                      inputName={inputName}
                      Types={colType}
                    />
                  ) : (
                    React.Children.map(children, (child) => {
                      if (!React.isValidElement(child)) return null;
                      const typedChild = child as React.ReactElement<any>;
                      if (
                        !typedChild.props.children ||
                        !React.isValidElement(typedChild.props.children)
                      )
                        return null;
                      const typedNestedChild = typedChild.props
                        .children as React.ReactElement<any>;
                      const childData = typedNestedChild.props.data;
                      if (!childData) return null;
                      const childCompareValue = compareProperty
                        ? childData[compareProperty]
                        : childData.id;
                      const dataCompareValue = compareProperty
                        ? row[compareProperty]
                        : row.id;
                      if (childCompareValue === dataCompareValue) {
                        return React.cloneElement(typedChild, {
                          children: React.cloneElement(typedNestedChild, {
                            data: row,
                            handleEditClick,
                            handleDeleteClick,
                            editableRow,
                            onClickRow,
                          }),
                        });
                      }
                      return null;
                    })
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Object.keys(headcol).length + (editableRow ? 1 : 0)}
                  className="text-center py-4"
                >
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showArrowButtons && (
      <div className="relative mt-7 mb-5">
        <button
          onClick={scrollToRight}
          style={{
            position: "absolute",
            right: "5px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            padding: "4px",
            borderRadius: "50%",
            zIndex: 20,
          }}
        >
          <RiArrowRightLine
            style={{ width: "24px", height: "24px", color: "#333" }}
          />
        </button>
        <button
          onClick={scrollToLeft}
          style={{
            position: "absolute",
            left: "5px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            padding: "4px",
            borderRadius: "50%",
            zIndex: 20,
          }}
        >
          <RiArrowLeftLine
            style={{ width: "24px", height: "24px", color: "#333" }}
          />
        </button>
      </div>)}
    </>
  );
};

export default CustomProTable;
