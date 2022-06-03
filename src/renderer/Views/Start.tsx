import { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './Start.css';
import AppTable from 'renderer/Models/AppTable';
import AppTableContext from 'renderer/AppFileContext';

export default function Start() {
  const navigate = useNavigate();
  const tables: AppTable[] = useContext(AppTableContext);

  useEffect(() => {
    window.electron.ipcRenderer.on('file-io-response', (arg: any) => {
      // const _operation = arg[0];
      // @TODO: move to callback
      const filepath = arg[1];
      const data = arg[2];
      let isAdded = false;

      // Make sure we haven't already loaded this file
      for (let i = 0; i < tables.length; i += 1) {
        const table = tables[i];
        if (table.filename === filepath) {
          table.read(data); // Overwrite?
          isAdded = true;
        }
      }

      // if it wasn't already added, add the new table
      if (!isAdded) {
        const length = tables.push(new AppTable(filepath));
        tables[length - 1].read(data);
      }
      navigate('/TableView', { replace: true });
    });
  }, [navigate, tables]);

  function onNew() {
    window.electron.ipcRenderer.sendMessage('file-io', ['new']);
  }

  function onLoad() {
    window.electron.ipcRenderer.sendMessage('file-io', ['load']);
  }

  return (
    <div>
      <Container fluid className="vertical-center">
        <Row className="justify-content-sm-center">
          <Col sm="auto" className="text-center">
            <Button variant="secondary" size="lg" onClick={() => onNew()}>
              New
            </Button>
          </Col>
          <Col sm="auto" className="text-center">
            <Button variant="primary" size="lg" onClick={() => onLoad()}>
              Load
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <h3 id="main-instructions">
            Click one of the buttons above to create a new app table or edit an
            existing one
          </h3>
        </Row>
      </Container>
    </div>
  );
}
