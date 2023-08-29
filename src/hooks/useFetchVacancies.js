import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom"

import { useMessage } from "../contexts/MessageContext";

import { apiSimt } from "../services/api"

export const useFetchVacancies = () => {

  const { setVacancyMessage } = useMessage();

  const [vacancyLoading, setVacancyLoading] = useState(false);

  const redirect = useNavigate();
  
  const url = apiSimt();

  const searchVacancies = useCallback(async (search, course) => {
    setVacancyLoading(true)

    let urlToFetch = `${url}/buscarTitulo?titulo=${search}`;
  
    if (course) {
      urlToFetch = `${url}/buscarTitulo?titulo=${search}&cursoNome=${course}`;
    }

    return fetch(urlToFetch, {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      }
    }).then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      setVacancyLoading(false);
      return responseJson;
    })
    .catch((err) => {
      setVacancyMessage({msg:"Não foi possível buscar vagas.", type:"error"});
      setVacancyLoading(false);
    })
  } , [url, setVacancyMessage])
  
  const getAllVacancies = useCallback(async (course) => {
    setVacancyLoading(true);
  
    let urlToFetch = `${url}/vagas/`;
  
    if (course) {
      urlToFetch = `${url}/vagas/?cursoNome=${course}`;
    }
  
    return fetch(urlToFetch, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Erro com o servidor');
      }
      return response.json();
    })
    .then((responseJson) => {
      setVacancyLoading(false);
      return responseJson;
    })
    .catch((err) => {
      setVacancyLoading(false);
      setVacancyMessage({msg:"Não foi possível carregar vagas.", type:"error"});
      return null;
    });
  
  }, [url, setVacancyMessage]);

  const getVacancy = useCallback( async(id) => {
    setVacancyLoading(true);
  
    return fetch(`${url}/vagas/${id}/`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Erro com o servidor');
      }
      return response.json();
    })
    .then((responseJson) => {
      setVacancyLoading(false);
      setVacancyMessage("")
      return responseJson;
    })
    .catch((err) => {
      setVacancyMessage({msg:"Não foi possível carregar dados da vaga.", type:"error" });
      setVacancyLoading(false);
      return null;
    });

  }, [url, setVacancyMessage]);

  const postVacancy = async(data) => {
    setVacancyLoading(true);
  
    return fetch(`${url}/vagas/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }else{
        throw new Error('Erro com o servidor');
      }
    })
    .then((responseJson) => {
        setVacancyMessage({msg: "Vaga publicada com sucesso.", type: "success"})
        setVacancyLoading(false);
        redirect("/");
        return responseJson;
    })
    .catch((err) => {
      setVacancyMessage({msg:"Não foi possível publicar a vaga.", type:"error"})
      setVacancyLoading(false);
    });
  };
  
  const putVacancy = async(data, id) => {
    setVacancyLoading(true);
  
    return fetch(`${url}/vagas/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then( async (response) => {
      if (response.status === 200) {
        setVacancyMessage({msg: "Vaga atualizada com sucesso.", type: "success" })
        setVacancyLoading(false);
        redirect("/");
      }else{
        throw new Error('Erro com o servidor');
      }
    })
    .catch((err) => {
      setVacancyMessage({msg:"Não foi possível atualizar a vaga.", type:"error"});
      setVacancyLoading(false);
    });
  };
  
  const deleteVacancy = async (id) => {
    setVacancyLoading(true);
  
    try {
      await fetch(`${url}/vagas/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      setVacancyMessage({msg: "Vaga excluída com sucesso.", type: "success" })
      redirect("/");
  
    } catch (err) {
      setVacancyMessage({msg:"Não foi possível excluir a vaga.", type:"error"})
    }
  
    setVacancyLoading(false);
  };

  const sendResumeToVacancy = async(studentId, vacancyId) => {
    setVacancyLoading(true);
    return fetch(`${url}/participar/${studentId}/${vacancyId}/`, {
      method: "PUT"
      }
    )
    .then((response) => {
      if(response.status === 200){
        setVacancyMessage({msg: "Participação confirmada com sucesso.", type: "send-resume-success"})
        setVacancyLoading(false);
      }else if(response.status === 409){
        setVacancyMessage({msg: "Você já está participando desta vaga.", type: "send-resume-conflict"})
        setVacancyLoading(false);
      }else{
        throw new Error('Erro com o servidor');
      }
    })
    .catch((err) => {
      setVacancyMessage({msg: "Não foi possível participar desta vaga.", type: "send-resume-error"})
      setVacancyLoading(false);
    })
  }

  const downloadResumes = async(id, vacancyTitle) => {
    setVacancyLoading(true)
    return fetch(`${url}/baixar-curriculos/${id}/`, {
        method: 'POST',
        responseType: 'arraybuffer',
    }).then(async (response) => {
      if(response.status === 200){
        let data = await response.arrayBuffer();
        let blob = new Blob([data], { type: 'application/zip' });

        let url = window.URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;
        let vacancyFile = `${vacancyTitle}.zip`;
        link.setAttribute('download', vacancyFile);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setVacancyMessage({msg: "Parabéns! Seu download está pronto.", type: "download-resume-success"})
        setVacancyLoading(false)
      }else{
        setVacancyMessage({msg: "Ninguem participou desta vaga ainda.", type: "download-resume-void"})
        setVacancyLoading(false)
      }
    }).catch((err) => {
      setVacancyMessage({msg: "Não foi possível baixar currículos desta vaga.", type: "download-resume-error"})
      setVacancyLoading(false)
    });
  }

  return {searchVacancies, getAllVacancies, getVacancy, postVacancy, putVacancy, deleteVacancy, sendResumeToVacancy, downloadResumes, vacancyLoading}
}