import AppTable from 'renderer/Models/AppTable';
import AppTableContext from 'renderer/AppFileContext';
import { useContext } from 'react';
import { Container, Table } from 'react-bootstrap';
import SwitchState from 'renderer/Models/SwitchState';
import EditableCell from 'renderer/Components/EditableCell';
import './TableView.css';

export default function TableView() {
  const tables: AppTable[] = useContext(AppTableContext);

  function renderStates() {
    if (tables.length > 0) {
      const table = tables[0];
      table.resolveAllStateReturnIds();
      return table.stateMap.map((state) => {
        const stateId = state.getStateId(table.stateMap);
        return (
          <tr key={stateId}>
            <td>{stateId}</td>
            <EditableCell value={state.name} />

            {state.returnStateIds.map((id) => {
              return <EditableCell value={id.toString()} />;
            })}

            {[
              ...Array(SwitchState.MAX_STATES - state.returnStateIds.length),
            ].map(() => {
              return <EditableCell value="" />;
            })}
            <EditableCell value={state.description} />
          </tr>
        );
      });
    }
    return <tr>None</tr>;
  }

  return (
    <Container fluid>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>StateID</th>
            <th>Name</th>
            {[...Array(SwitchState.MAX_STATES).keys()].map((x) => (
              <th>{x}</th>
            ))}
            <th>description</th>
          </tr>
        </thead>
        <tbody>{renderStates()}</tbody>
      </Table>
    </Container>
  );
}
