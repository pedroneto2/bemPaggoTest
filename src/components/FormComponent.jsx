import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";

import { Form, Button, Row, Col, Spinner, Table, Alert } from "react-bootstrap";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { FaReact } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { FaAngular } from "react-icons/fa";

const STICKIES = [
  { value: "reactSticky", label: "React", Icon: FaReact },
  { value: "vueSticky", label: "Vue", Icon: FaVuejs },
  { value: "angularSticky", label: "Angular", Icon: FaAngular },
];

const INITIAL_VALUES = {
  name: "",
  lastName: "",
  cep: "",
  address: "",
  city: "",
  district: "",
  state: "",
  reactSticky: 0,
  vueSticky: 0,
  angularSticky: 0,
};

const fieldValidation = (min, max) => {
  return yup
    .string()
    .required("Campo obrigatório!")
    .min(min, `Mínimo de ${min} caracteres!`)
    .max(max, `Máximo de ${max} caracteres!`);
};

const stickiesFieldValidation = () => {
  return yup
    .number()
    .test(
      "",
      "Você precisa ter pelo menos 1 adesivo no total.",
      (value, context) => {
        const { reactSticky, vueSticky, angularSticky } = context.parent;
        return reactSticky !== 0 || vueSticky !== 0 || angularSticky !== 0;
      }
    );
};

const formSchema = yup.object().shape({
  name: fieldValidation(3, 50),
  lastName: fieldValidation(3, 50),
  cep: fieldValidation(8, 8),
  address: fieldValidation(5, 50),
  city: fieldValidation(3, 50),
  district: fieldValidation(3, 50),
  state: fieldValidation(2, 50),
  reactSticky: stickiesFieldValidation(),
});

const retrieveCepData = async (
  cep,
  values,
  setValues,
  setLoadCEP,
  setError
) => {
  try {
    setLoadCEP(true);
    const request = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    const { logradouro, localidade, bairro, uf } = request.data;
    setValues({
      ...values,
      address: logradouro,
      city: localidade,
      district: bairro,
      state: uf,
    });
  } catch (error) {
    setError({
      title: error.message || "Erro inesperado",
      message: "Por favor, tente novamente mais tarde.",
    });
  } finally {
    setLoadCEP(false);
  }
};

const simulateApiPost = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const FormComponent = () => {
  const [loadCEP, setLoadCEP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ title: "", message: "" });

  const navigate = useNavigate();

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useFormik({
    initialStatus: false,
    initialValues: INITIAL_VALUES,
    validationSchema: formSchema,
    onSubmit: async (formData) => {
      try {
        setLoading(true);
        await simulateApiPost();
        navigate("/checkout");
      } catch (error) {
        setError({
          title: error.message || "Erro inesperado",
          message: "Por favor, tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (values.cep.length === 8) {
      retrieveCepData(values.cep, values, setValues, setLoadCEP, setError);
    }
  }, [values.cep]);

  return (
    <div>
      {error.title && (
        <Alert
          variant="danger"
          onClose={() => setError({ title: "", message: "" })}
          dismissible
        >
          <Alert.Heading>{error.title}</Alert.Heading>
          <p>{error.message}</p>
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              required
              type="text"
              name="name"
              placeholder="Insira o nome"
              disabled={loading}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.name && !errors.name}
              isInvalid={touched.name && errors.name}
            />
            <Form.Control.Feedback>Tudo certo!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control
              required
              type="text"
              name="lastName"
              placeholder="Insira o sobrenome"
              disabled={loading}
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.lastName && !errors.lastName}
              isInvalid={touched.lastName && errors.lastName}
            />
            <Form.Control.Feedback>Tudo certo!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Label>CEP - Insira para carregar seu endereço</Form.Label>
            <Form.Control
              required
              type="text"
              name="cep"
              placeholder="Insira seu CEP"
              value={values.cep}
              disabled={loading}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.cep && !errors.cep}
              isInvalid={touched.cep && errors.cep}
            />
            <Form.Control.Feedback>Tudo certo!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.cep}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              required
              type="text"
              name="address"
              placeholder="Insira seu endereço"
              disabled={loadCEP || loading}
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.address && !errors.address}
              isInvalid={touched.address && errors.address}
            />
            <Form.Control.Feedback>Tudo certo!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.cep}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              required
              type="text"
              name="city"
              placeholder="Insira sua cidade"
              disabled={loadCEP || loading}
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.city && !errors.city}
              isInvalid={touched.city && errors.city}
            />
            <Form.Control.Feedback>Tudo certo!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.city}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Form.Label>Bairro</Form.Label>
            <Form.Control
              required
              type="text"
              name="district"
              placeholder="Insira seu bairro"
              disabled={loadCEP || loading}
              value={values.district}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.district && !errors.district}
              isInvalid={touched.district && errors.district}
            />
            <Form.Control.Feedback>Tudo certo!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.district}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              required
              type="text"
              name="state"
              placeholder="Insira seu estado"
              disabled={loadCEP || loading}
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.state && !errors.state}
              isInvalid={touched.state && errors.state}
            />
            <Form.Control.Feedback>Tudo certo!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.state}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Table striped>
            <thead>
              <tr>
                <th>Adesivos</th>
                <th className="d-flex justify-content-center">Quantidade</th>
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
                    <Button
                      style={{ height: 40 }}
                      disabled={loading}
                      className="px-2 mx-2"
                      onClick={() => {
                        if (values[sticky.value] <= 0) return;
                        setValues({
                          ...values,
                          [sticky.value]: values[sticky.value] - 1,
                        });
                      }}
                    >
                      <FiMinusSquare size={20} />
                    </Button>
                    <Form.Control
                      className="text-center fw-bold fs-5"
                      style={{ width: 60 }}
                      min={0}
                      type="number"
                      name={sticky.value}
                      value={values[sticky.value]}
                      onBlur={handleBlur}
                      disabled={loading}
                      onChange={(e) => {
                        if (e.target.value < 0 || e.target.value === "") {
                          e.target.value = 0;
                        }
                        handleChange(e);
                      }}
                    />
                    <Button
                      style={{ height: 40 }}
                      disabled={loading}
                      className="px-2 mx-2"
                      onClick={() =>
                        setValues({
                          ...values,
                          [sticky.value]: values[sticky.value] + 1,
                        })
                      }
                    >
                      <FiPlusSquare size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td className="d-flex justify-content-center fw-bold fs-4">
                  {`Total: ${
                    values.angularSticky + values.reactSticky + values.vueSticky
                  }`}
                </td>
              </tr>
            </tbody>
          </Table>
        </Row>
        {errors.reactSticky && touched.reactSticky && (
          <p className="fs-4" style={{ color: "red" }}>
            {errors.reactSticky}
          </p>
        )}
        <Button
          style={{ width: 100, height: 45 }}
          type="submit"
          disabled={loadCEP || loading}
        >
          {loadCEP || loading ? (
            <Spinner animation="border" variant="white" />
          ) : (
            "Enviar"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default FormComponent;
