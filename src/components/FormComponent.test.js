/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, waitFor } from "@testing-library/react";
import FormComponent from "components/FormComponent";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Testing FormComponent", () => {
  test("Render elements", () => {
    render(
      <BrowserRouter>
        <FormComponent />
      </BrowserRouter>
    );

    const inputs = [
      "Insira o nome",
      "Insira o sobrenome",
      "Insira seu CEP",
      "Insira seu endereço",
      "Insira sua cidade",
      "Insira seu bairro",
      "Insira seu estado",
    ];

    inputs.forEach((input) => {
      const linkElement = screen.getByPlaceholderText(input);
      expect(linkElement).toBeInTheDocument();
    });
    const quantityInputs = screen.getAllByDisplayValue(0);
    expect(quantityInputs).toHaveLength(3);
    const reactText = screen.getByText("React");
    expect(reactText).toBeInTheDocument();
    const vueText = screen.getByText("Vue");
    expect(vueText).toBeInTheDocument();
    const angularText = screen.getByText("Angular");
    expect(angularText).toBeInTheDocument();
  });

  test("Properly handle quantities", async () => {
    render(
      <BrowserRouter>
        <FormComponent />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");
    const quantityFields = screen.getAllByDisplayValue(0);

    // fields do not decrease less then zero
    userEvent.click(buttons[0]);
    userEvent.click(buttons[2]);
    userEvent.click(buttons[4]);
    expect(quantityFields[0].value).toBe("0");
    expect(quantityFields[1].value).toBe("0");
    expect(quantityFields[2].value).toBe("0");

    // fields increasing properly
    userEvent.click(buttons[1]);
    userEvent.click(buttons[3]);
    userEvent.click(buttons[3]);
    userEvent.click(buttons[5]);
    userEvent.click(buttons[5]);
    userEvent.click(buttons[5]);
    await waitFor(() => {
      const quantityFields = screen.getAllByDisplayValue(/[0-9]/);
      expect(quantityFields[0].value).toBe("1");
      expect(quantityFields[1].value).toBe("2");
      expect(quantityFields[2].value).toBe("3");
    });

    const total = quantityFields.reduce(
      (sum, element) => sum + +element.value,
      0
    );
    const totalRegex = new RegExp(`Total: ${total}`);
    const totalField = screen.getByText(totalRegex);
    expect(totalField).toBeInTheDocument();
  });

  test("Error Msgs 'Campo obrigatório!'", async () => {
    render(
      <BrowserRouter>
        <FormComponent />
      </BrowserRouter>
    );

    const sendButton = screen.getByRole("button", { name: "Enviar" });
    userEvent.click(sendButton);
    await waitFor(() => {
      const errorMsgs = screen.getAllByText("Campo obrigatório!");
      expect(errorMsgs).toHaveLength(7);
    });
  });

  test("Error Msgs 'Mínimo de X caracteres!'", async () => {
    render(
      <BrowserRouter>
        <FormComponent />
      </BrowserRouter>
    );

    const inputs = [
      "Insira o nome",
      "Insira o sobrenome",
      "Insira seu CEP",
      "Insira seu endereço",
      "Insira sua cidade",
      "Insira seu bairro",
      "Insira seu estado",
    ];

    inputs.forEach((input) => {
      const fieldElement = screen.getByPlaceholderText(input);
      userEvent.type(fieldElement, "a");
    });

    const sendButton = screen.getByRole("button", { name: "Enviar" });
    userEvent.click(sendButton);
    await waitFor(() => {
      const errorMsgs = screen.getAllByText(/Mínimo de [238] caracteres!/);
      expect(errorMsgs).toHaveLength(7);
    });
  });

  test("Error Msgs 'Máximo de Y caracteres!'", async () => {
    render(
      <BrowserRouter>
        <FormComponent />
      </BrowserRouter>
    );

    const inputs = [
      "Insira o nome",
      "Insira o sobrenome",
      "Insira seu CEP",
      "Insira seu endereço",
      "Insira sua cidade",
      "Insira seu bairro",
      "Insira seu estado",
    ];

    const text = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    inputs.forEach(async (input) => {
      const fieldElement = screen.getByPlaceholderText(input);
      userEvent.paste(fieldElement, text);
    });

    const sendButton = screen.getByRole("button", { name: "Enviar" });
    userEvent.click(sendButton);
    await waitFor(() => {
      const errorMsgs = screen.getAllByText(/Máximo de (8|50) caracteres!/);
      expect(errorMsgs).toHaveLength(7);
    });
  });

  test("Error Msgs 'Você precisa ter pelo menos 1 adesivo no total.'", async () => {
    render(
      <BrowserRouter>
        <FormComponent />
      </BrowserRouter>
    );

    const inputs = [
      "Insira o nome",
      "Insira o sobrenome",
      "Insira seu endereço",
      "Insira sua cidade",
      "Insira seu bairro",
      "Insira seu estado",
    ];

    const text = "aaaaaaaaaa";

    inputs.forEach(async (input) => {
      const fieldElement = await screen.findByPlaceholderText(input);
      userEvent.paste(fieldElement, text);
    });

    const cepElement = await screen.findByPlaceholderText("Insira seu CEP");
    userEvent.paste(cepElement, "12345600");

    const sendButton = await screen.findByRole("button", { name: "Enviar" });
    userEvent.click(sendButton);
    await waitFor(() => {
      const errorMsg = screen.getByText(
        "Você precisa ter pelo menos 1 adesivo no total."
      );
      expect(errorMsg).toBeInTheDocument();
    });
  });

  test("Success Msgs 'Tudo certo!'", async () => {
    render(
      <BrowserRouter>
        <FormComponent />
      </BrowserRouter>
    );

    const inputs = [
      "Insira o nome",
      "Insira o sobrenome",
      "Insira seu endereço",
      "Insira sua cidade",
      "Insira seu bairro",
      "Insira seu estado",
    ];

    const text = "aaaaaaaaaa";

    inputs.forEach(async (input) => {
      const fieldElement = await screen.findByPlaceholderText(input);
      userEvent.paste(fieldElement, text);
    });

    const cepElement = await screen.findByPlaceholderText("Insira seu CEP");
    userEvent.paste(cepElement, "12345600");

    const buttons = await screen.findAllByRole("button");

    userEvent.click(buttons[1]);

    const sendButton = await screen.findByRole("button", { name: "Enviar" });
    userEvent.click(sendButton);
    await waitFor(() => {
      const successMsgs = screen.getAllByText("Tudo certo!");
      expect(successMsgs).toHaveLength(7);
    });
  });
});
