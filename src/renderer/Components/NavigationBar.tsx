import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

interface NavProps {
  name: string;
}

function NavigationBar(props: NavProps) {
  const { name } = props;

  return (
    <>
      <Navbar bg="light" expand="sm">
        <Container fluid>
          <LinkContainer to="">
            <Navbar.Brand>{name}</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/MapView">
                <Nav.Link>Map View</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/TableView">
                <Nav.Link>Table View</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
