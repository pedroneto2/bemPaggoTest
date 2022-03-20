import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row, Table, Button, Spinner } from "react-bootstrap";

import { FaReact } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { FaAngular } from "react-icons/fa";

const STICKIES = [
  { value: "reactSticky", label: "React", Icon: FaReact },
  { value: "vueSticky", label: "Vue", Icon: FaVuejs },
  { value: "angularSticky", label: "Angular", Icon: FaAngular },
];

const simulateApiGet = async (setValues) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        setValues({
          reactSticky: Math.ceil(Math.random() * 100),
          vueSticky: Math.ceil(Math.random() * 100),
          angularSticky: Math.ceil(Math.random() * 100),
        })
      );
    }, 1000);
  });
};

const CheckoutComponent = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    reactSticky: 0,
    vueSticky: 0,
    angularSticky: 0,
  });

  useEffect(() => {
    const retrieveStickies = async () => {
      setLoading(true);
      await simulateApiGet(setValues);
      setLoading(false);
    };
    retrieveStickies();
  }, []);

  return loading ? (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="white" />
    </div>
  ) : (
    <Container className="my-5 py-3 px-0 rounded bg-white shadow">
      <Row>
        <Col>
          <h3
            className="text-white text-center fw-bold bg-secondary py-2"
            style={{ letterSpacing: 10 }}
          >
            CHECKOUT
          </h3>
        </Col>
      </Row>
      <Row className="m-3">
        <Table striped>
          <thead>
            <tr>
              <th className="fs-4">Adesivos</th>
              <th className="d-flex justify-content-center fs-4">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {STICKIES.map((sticky) => (
              <tr key={sticky.value}>
                <td>
                  <div className="d-flex align-items-center">
                    <sticky.Icon className="mx-2 text-secondary" size={30} />
                    <p className="fs-3 m-0 p-0 fw-bold">{sticky.label}</p>
                  </div>
                </td>
                <td className="d-flex justify-content-center align-items-center">
                  <p className="fw-bold fs-3 my-auto">{values[sticky.value]}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <Row className="mx-3 d-flex justify-content-around">
        <Button
          className="my-3 fs-5 fw-bold"
          variant="secondary"
          style={{ width: 200 }}
          onClick={() => navigate("/")}
        >
          Cancelar
        </Button>
        <Button className="my-3 fs-5 fw-bold" style={{ width: 200 }}>
          Prosseguir
        </Button>
      </Row>
    </Container>
  );
};

export default CheckoutComponent;
