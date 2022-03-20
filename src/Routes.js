import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FormLayout from "layout/FormsLayout";
import CheckoutComponent from "components/Checkout";

import { FiPackage } from "react-icons/fi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <FormLayout
              Icon={FiPackage}
              text1="Formulário"
              text2="para compra de"
              text3="Pacote de adesivos"
            />
          }
        />
        <Route path="/checkout" element={<CheckoutComponent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
