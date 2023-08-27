// React-Router-Dom
import { Routes, Route } from "react-router-dom";

// Pages
import Login from '../pages/Login/Login';
import Error from "../pages/Error/Error";

const SignRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Error />} />
    </Routes>
  )
}

export default SignRoutes;