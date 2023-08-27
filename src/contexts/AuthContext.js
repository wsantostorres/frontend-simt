import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiSimt, apiSuap } from "../services/api";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {

  // api urls
  const urlSIMT = apiSimt();
  const urlSuap = apiSuap();
  
  // states
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [bondType, setBondType] = useState();
  const [course, setCourse] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState();

  const login = async (registration, password) => {
    setLoading(true)
    
    const data = {
        "username":registration,
        "password":password
    }

    let responseAuthentication;

    // authentication
    try{
      responseAuthentication = await authenticationSuap(data)
      
      if(responseAuthentication.status === 401){
        setError("Credenciais inválidas.")
        setLoading(false)
        return;
      }

      if(responseAuthentication.status !== 200 && responseAuthentication.status !== 401){
        setError("Ocorreu um erro.")
        setLoading(false)
        return;
      }
      
    }catch(err){
      setError("Não foi possível estabelecer conexão com o servidor.")
      setLoading(false)
      return;
    }

    // save or update user
    try{
      const tokenResp = await responseAuthentication.json();
      const dataUserSUAP = await getDataUserSuap(tokenResp.access);
      const dataUserSIMT = await getDataUserSimt(tokenResp.access); 

      if(dataUserSUAP.tipoVinculo === "Aluno"){

        localStorage.setItem('tokenSUAP', JSON.stringify(tokenResp))

        if(dataUserSIMT.tipoVinculo === undefined || dataUserSIMT.tipoVinculo === null){
          let response = await saveUserSimt(dataUserSIMT.id, dataUserSUAP.matricula, dataUserSUAP.nomeCompleto, dataUserSUAP.tipoVinculo, dataUserSUAP.curso)
          
          if(response.status !== 201){
            localStorage.removeItem('tokenSUAP');
            setError("Não foi possível estabelecer conexão com o servidor.")
            return;
          }
        }

        setToken(tokenResp)
        setId(dataUserSIMT.id)
        setName(dataUserSUAP.nomeCompleto)
        setBondType(dataUserSUAP.tipoVinculo)
        setCourse(dataUserSUAP.curso)
        
      }else if(dataUserSUAP.tipoVinculo === "Servidor"){
        localStorage.setItem('tokenSUAP', JSON.stringify(tokenResp))

        if(dataUserSIMT.tipoVinculo === undefined || dataUserSIMT.tipoVinculo === null){
          saveUserSimt(dataUserSIMT.id, dataUserSUAP.matricula, dataUserSUAP.nomeCompleto, dataUserSUAP.tipoVinculo)
        }

        setToken(tokenResp.access)
        setId(dataUserSIMT.id)
        setName(dataUserSUAP.nomeCompleto)
        setBondType(dataUserSUAP.tipoVinculo)

      }else{
        setError("Você não possui um vínculo válido.")
      }

      setError("") // clear error if login has occurred
    }catch(err){
      localStorage.removeItem('tokenSUAP');
      setError("Não foi possível estabelecer conexão com o servidor.")
    }

    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('tokenSUAP')
    setToken("")
    setId("")
    setName("")
    setBondType("")
    setCourse("")
  }

  // functions SIMT
  const getDataUserSimt = useCallback(async (tokenToGetData) => {
    const response = await fetch(`${urlSIMT}/user/dados/${tokenToGetData}/`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      }
    })

    const dataUserSIMT = response.json();
    return dataUserSIMT;
  }, [urlSIMT])

  const saveUserSimt = async (id, registration, fullName, bondType, course) => {
    if(bondType === "Aluno"){

      let data = {
        id: id,
        matricula: registration,
        nomeCompleto: fullName,
        tipoVinculo: bondType,
        curso: course
      }

      const response = await fetch(`${urlSIMT}/alunos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      return response;
    }else if(bondType === "Servidor"){
      
      let data = {
        id: id,
        matricula: registration,
        nomeCompleto: fullName,
        tipoVinculo: bondType,
      }

      const response = await fetch(`${urlSIMT}/servidores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      return response;

    }else{

    }
  }

  // functions SUAP
  const authenticationSuap = async (data) => {
    const response = await fetch(`${urlSuap}/api/v2/autenticacao/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    return response;
  }

  const getDataUserSuap = async (tokenToGetData) => {
    const response = await fetch(`${urlSuap}/api/v2/minhas-informacoes/meus-dados/`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenToGetData}`
      },
    })

    const dataUserSUAP = await response.json();

    let data = {
        "id": dataUserSUAP.id,
        "matricula": dataUserSUAP.matricula,
        "nomeCompleto": dataUserSUAP.vinculo.nome,
        "tipoVinculo": dataUserSUAP.tipo_vinculo,
        "curso": ""
    }

    if(dataUserSUAP.curso !== null && dataUserSUAP.curso !== ""){
        data.curso = dataUserSUAP.vinculo.curso;
    }

    return data;
  }

  const verifyToken = useCallback(async (tokenToVerify) => {
    if(tokenToVerify){
      const data = {
          "token":tokenToVerify
      }

      const response = await fetch(`${urlSuap}/api/v2/autenticacao/token/verify/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      const status = await response.status;
      return status;
    }
  }, [urlSuap])

  const refreshToken = useCallback(async (tokenRefresh) => {
    if(tokenRefresh){
      const data = {
          "refresh":tokenRefresh
      }

      const response = await fetch(`${urlSuap}/api/v2/autenticacao/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      return response;
    }
  }, [urlSuap])

  useEffect(() => {

    const tokenStoraged = JSON.parse(localStorage.getItem('tokenSUAP'));

    if(tokenStoraged){
        (async () => {
            setLoading(true)

            try{
              const status = await verifyToken(tokenStoraged.access);
              const dataUserSIMT = await getDataUserSimt(tokenStoraged.access);
              
              if(status === 200){
                setId(dataUserSIMT.id);
                setToken(tokenStoraged);
                setName(dataUserSIMT.nomeCompleto);
                setBondType(dataUserSIMT.tipoVinculo);

                if(dataUserSIMT.curso !== ""){
                  setCourse(dataUserSIMT.curso);
                }
        
              }else{
                try {
                  // update token
                  const response = await refreshToken(tokenStoraged.refresh);
                  
                  if(response.status === 200){
                    const newAccess = await response.json();                   

                    const newToken = {
                      refresh: tokenStoraged.refresh,
                      access: newAccess.access
                    }

                    localStorage.setItem('tokenSUAP', JSON.stringify(newToken))

                    const dataUserSIMT = await getDataUserSimt(newToken.access);
                    setId(dataUserSIMT.id);
                    setToken(newToken);
                    setName(dataUserSIMT.nomeCompleto);
                    setBondType(dataUserSIMT.tipoVinculo);
  
                    if(dataUserSIMT.curso !== ""){
                      setCourse(dataUserSIMT.curso);
                    }

                  }else{
                    logout();
                    setError("Não foi possível validar seu acesso.")
                  }
                }catch (err) {
                  setError("Não foi possível estabelecer conexão com o servidor ou não foi possível validar seu acesso.");
                }
              }

            }catch(err){
              setError("Não foi possível estabelecer conexão com o servidor.");
            }

            setLoading(false)
        })()
    }

}, [getDataUserSimt, verifyToken, refreshToken])


  return (
    <AuthContext.Provider value={{ token, id, name, bondType, course, error, loading, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context;
}
