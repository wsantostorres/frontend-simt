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
    
    const getDataUserSuap = useCallback(async (tokenToGetData) => {
        const response = await fetch(`${url}/api/v2/minhas-informacoes/meus-dados/`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${tokenToGetData}`
          },
        })
    
        const dataUserSUAP = await response.json();
    
        let data = {
            "registration": dataUserSUAP.matricula,
            "fullName": dataUserSUAP.vinculo.nome,
            "bondType": dataUserSUAP.tipo_vinculo,
            "course": ""
        }
    
        if(dataUserSUAP.curso !== null && dataUserSUAP.curso !== ""){
            data.course = dataUserSUAP.vinculo.curso;
        }
    
        return data;
    }, [url])
    
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
