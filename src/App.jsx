import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "pages/HomePage";
import MainLayout from "layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
