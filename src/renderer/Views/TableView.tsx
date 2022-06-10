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
      return table.renderables.map((renderable) => {
        if (renderable instanceof SwitchState) {
          const stateId = renderable.getStateId(table.stateMap);
          return (
            <tr key={stateId}>
              <td>{stateId}</td>
              <EditableCell value={renderable.name} />

              {renderable.returnStateIds.map((id) => {
                return <EditableCell value={id.toString()} />;
              })}

              {[
                ...Array(
                  SwitchState.MAX_STATES - renderable.returnStateIds.length
                ),
              ].map(() => {
                return <EditableCell value="" />;
              })}
              <EditableCell value={renderable.description} />
            </tr>
          );
        }
        return (
          <tr>
            <EditableCell
              colSpan={SwitchState.MAX_STATES + 3}
              value={renderable.descriptionLines.join('\n')}
            />
          </tr>
        );
      });
    }
    return (
      <tr>
        <p>None</p>
      </tr>
    );
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
