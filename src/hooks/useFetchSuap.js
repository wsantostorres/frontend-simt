import { useCallback } from "react";
import { apiSuap } from "../services/api"

export const useFetchSuap = () => {

    const url = apiSuap();

    const authenticationSuap = async (data) => {
        const response = await fetch(`${url}/api/v2/autenticacao/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    
        return response;
    }
    
    const getDataUserSuap = async (tokenToGetData) => {
        const response = await fetch(`${url}/api/v2/minhas-informacoes/meus-dados/`, {
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
    
          const response = await fetch(`${url}/api/v2/autenticacao/token/verify/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
    
          const status = await response.status;
          return status;
        }
    }, [url])
    
    const refreshToken = useCallback(async (tokenRefresh) => {
        if(tokenRefresh){
          const data = {
              "refresh":tokenRefresh
          }
    
          const response = await fetch(`${url}/api/v2/autenticacao/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
    
          return response;
        }
    }, [url])

  return { authenticationSuap, getDataUserSuap, verifyToken, refreshToken }
}
