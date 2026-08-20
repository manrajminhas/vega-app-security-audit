import { Table} from 'react-bootstrap';



const AdminTable = ({ 
  data, 
  columns
}) => {

  let tableBody;

  if (data.length > 0) {
    tableBody = data.map(item => (
      <tr key={item.id}>
        {columns.map(column => (
          <td key={`${item.id}-${column.key}`}>
            {column.render ? column.render(item) : item[column.key]}
          </td>
        ))}
      </tr>
    ));
  } else {
    tableBody = (
      <tr>
        <td colSpan={columns.length} className="text-center py-4">
          No data available
        </td>
      </tr>
    );
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="mb-0">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {tableBody}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminTable;