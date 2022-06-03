import AppTable from 'renderer/Models/AppTable';
import AppTableContext from 'renderer/AppFileContext';
import { useEffect, useContext } from 'react';
import { NavItem } from 'react-bootstrap';

export default function TableView() {
  const tables: AppTable[] = useContext(AppTableContext);

  function renderStates() {
    if (tables.length > 0) {
      const table = tables[0];
      return (
        <div>
          {table.stateMap.map((item) => {
            return <p key={item.name}>{item.format(0)}</p>;
          })}
        </div>
      );
    }
    return <div>None</div>;
  }

  return <div>{renderStates()}</div>;
}
