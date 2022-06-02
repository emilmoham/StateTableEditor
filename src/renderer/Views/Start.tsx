import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './Start.css';

export default function Start() {
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.on('file-io-response', (arg: any) => {
      console.log('todo');
      navigate('/TableView', { replace: true });
    });
  }, [navigate]);

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
