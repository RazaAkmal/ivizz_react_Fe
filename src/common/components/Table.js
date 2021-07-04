import "../style.css"
import { openSecureLink } from "../HelperFunctions";

const Table = ({ columns, dataSource }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} scope='col'>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row, i) => (
          <tr key={i}>
            {row.urls.map((url, i) => (
              <td key={i}>
                <a style={{marginLeft: "5px"}} onClick={() => openSecureLink(url)} target='_blank'>Link</a>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
