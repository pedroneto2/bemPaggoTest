import { Container, Col } from "react-bootstrap";
import { FiList } from "react-icons/fi";

import FormComponent from "components/FormComponent";

const FormsLayout = ({ Icon = FiList, text1, text2, text3 }) => {
  return (
    <Container className="my-5 p-0 rounded bg-white shadow">
      <Col className="form-header bg-primary text-white p-0 d-flex align-items-center justify-content-center justify-content-md-around">
        <div className="ms-3 ms-md-5 me-3 me-md-0 text-end text-md-start">
          <p className="fs-4 fw-light m-0">{text1}</p>
          <p className="fs-4 fw-light m-0 ms-3">{text2}</p>
          <h3 className="fs-2 fw-bold m-0 ms-5">{text3}</h3>
        </div>
        <Icon className="mt-4 ms-0 me-0 me-md-5" size={225} />
      </Col>
      <Col className="p-4 p-md-5">
        <FormComponent />
      </Col>
    </Container>
  );
};

export default FormsLayout;
