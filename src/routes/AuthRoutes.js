import { Routes, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import HomeStudent from '../pages/Home/HomeStudent';
import HomeServer from '../pages/Home/HomeServer';
import Profile from '../pages/Profile/Profile';
import Post from "../pages/Post/Post";
import Error from "../pages/Error/Error";

const AuthRoutes = () => {

  const { bondType } = useAuth(); 

  return (
    <Routes>
        {bondType === "Aluno" && (
          <>
            <Route path="/" element={<HomeStudent />} />
            <Route path="/perfil" element={<Profile/>} />
            <Route path="/publicacao" element={<Post />} />
            <Route path="/publicacao/:id" element={<Post />} />
            <Route path="*" element={<Error />} />
          </>
        )}
        {bondType === "Servidor" && (
          <>
            <Route path="/" element={<HomeServer />} />
            <Route path="/publicacao" element={<Post />} />
            <Route path="/publicacao/:id" element={<Post />} />
            <Route path="*" element={<Error />} />
          </>
        )}
    </Routes>
  )
}

export default AuthRoutes;