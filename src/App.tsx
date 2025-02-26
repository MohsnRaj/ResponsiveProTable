import { Fragment } from 'react/jsx-runtime';
import CustomProTable from './Table/CustomProTable';
import data from "./Table/mock-data.json"
import ReadOnlyRow from './Table/components/ReadOnlyRow';
const colType = {
  picture: "file",
  name: "text",
  address: "text",
  telephone: "text",
  email: "text",
  fathername: "text",
  city: "text",
  // color: "text",
};
const headcol = {
    "عکس": null,
    "نام": "",
    "آدرس": "",
    "تلفن‌همراه": "",
    "ایمیل": "",
    "نام پدر": "",
    "شهر": "",
    // "رنگ": ""
};
function App() {

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl m-4 w-10/12 grid justify-center mx-auto">
<CustomProTable
            headcol={headcol}
            colType={colType}
            editableRow={true}
            data={data}
          >
            {
              data.map((dataitem,index)=>(
                <Fragment key={index}>
                  <ReadOnlyRow editableRow={true} data={dataitem} />
                </Fragment>
              ))
            }
          </CustomProTable>

    </div>
  )
}

export default App
