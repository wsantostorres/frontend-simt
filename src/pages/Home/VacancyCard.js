import { useState, useEffect } from "react";
import { useFetchVacancies } from "../../hooks/useFetchVacancies";
import { useMessage } from "../../contexts/MessageContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

import styles from './VancancyCard.module.css';

import parse from 'html-react-parser';

import { FiDownloadCloud } from 'react-icons/fi';
import { AiOutlineSend } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi';

const VacancyCard = ({id, title, description = "", date, type, morning, afternoon, night}) => {

    const { vacancyMessage, setVacancyMessage } = useMessage();
    const { id:studentId, bondType, studentVacancies } = useAuth();
    const { sendResumeToVacancy, downloadResumes, vacancyLoading } = useFetchVacancies();
    const [message, setMessage] = useState("");
    const [isApplied, setIsApplied] = useState();

    useEffect(() => {

        if(vacancyMessage && vacancyMessage.type !== "success"){
            setMessage(vacancyMessage);
            setVacancyMessage("");
        }

    }, [setVacancyMessage, vacancyMessage, setMessage])

    // Verifica se o ID da vaga está na lista de vagas do aluno
    useEffect(() => {
        if(studentVacancies !== null){
            try{
                setIsApplied(studentVacancies.includes(id));
            }catch(err){
                setIsApplied(null)
            }
        }
    }, [studentVacancies, id])
    

    const availability = (morning, afternoon, night) => {
        let arrayDisp = [];
        arrayDisp.push(morning)
        arrayDisp.push(afternoon)
        arrayDisp.push(night)

        let stringAvailability = ''
        for(let i = 0; i < arrayDisp.length; i++){
            if(arrayDisp[i] === 1){
                if(i === 0){
                    stringAvailability += "Manhã, "
                }else if(i === 1){
                    stringAvailability += "Tarde, "
                }else if(i === 2){
                    stringAvailability += "Noite"
                }else{
                    stringAvailability += ""
                }
            }
        }

        if(stringAvailability.length === 0){
            stringAvailability = 'Não informada'
        }

        return stringAvailability;
    }

    const formatDate = (date) => {
        let formattedDate
        if (date) {
          const parts = date.split('-');
          if (parts.length === 3) {
            formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        }
    
        return formattedDate;
    }

  return (
    <>
        <div className={styles.vacancyCardContainer}>
            <h3>{title}</h3>
            <div>
                {parse(description)}
            </div>
            <div className={styles.informationVacancy}>
                <div>
                    <p>Encerra:</p>
                    <p>{formatDate(date)}</p>
                </div>
                <div>
                    <p>Disponibilidade: </p>
                    <p>{availability(morning, afternoon, night)}</p>
                </div>
                <div>
                    <p>Tipo: </p>
                    <p>{type === 1 ? "Estágio" : "Jovem Aprendiz"}</p>
                </div>
            </div>
            <hr />
            <div className={styles.buttonsVacancy}>
                {bondType === "Servidor" && (
                    <>
                        <Link id="link-edit-vacancy" to={`/publicacao/${id}`}><BiEdit/> <span>Editar</span></Link>
                        <button id="btn-download-resumes" className={styles.buttonDownloadResumes} data-bs-toggle="modal" data-bs-target="#modalVacancy" onClick={async() => { await downloadResumes(id, title) }} ><FiDownloadCloud/><span>Baixar Currículos</span></button>
                    </>
                )}
               
               {bondType === "Aluno" && (
                    isApplied ? (
                        <button id="btn-send-resume-ok" type="button" className={styles.resumeSent}><BsCheckLg /> <span>Currículo Enviado</span></button>
                    ) : (
                        <button id="btn-send-resume" className={styles.buttonSendResume} data-bs-toggle="modal" data-bs-target="#modalVacancy" onClick={async () => { await sendResumeToVacancy(studentId, id) }}><AiOutlineSend /> <span>Enviar Currículo</span></button>
                    )
                )}
            </div>
        </div>

        <div className="modal" data-bs-backdrop="static" data-bs-keyboard="false" id="modalVacancy" tabIndex="-1" aria-hidden="true" aria-label="modal de processamento"> 
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body" >
                <div className=" p-5 text-center">
                    <p>{vacancyLoading && <span>Processando... Aguarde</span> }</p>

                    {/* success */}
                    {
                        !vacancyLoading && message && message.type === "download-resume-success" && 
                        (<p className="alert alert-success">{message.msg}</p>)
                    }
                    {
                        !vacancyLoading && message && message.type === "send-resume-success" && 
                        (<p className="alert alert-success">{message.msg}</p>)
                    }
                    {/* void and conflict */}
                    {
                        !vacancyLoading && message && message.type === "download-resume-void" && 
                        (<p className="alert alert-warning">{message.msg}</p>)
                    }
                    {
                        !vacancyLoading && message && message.type === "send-resume-conflict" && 
                        (<div> 
                            <p className="alert alert-warning">{message.msg}
                                <span className="d-block fw-bold" data-bs-dismiss="modal"><Link id="link-resume-register" to="/curriculo">Cadastrar Currículo</Link></span>
                            </p>
                        </div>)
                    }
                    {/* error */}
                    {
                        !vacancyLoading && message && message.type === "download-resume-error" && 
                        (<p className="alert alert-danger">{message.msg}</p>)
                    }
                    {
                        !vacancyLoading && message && message.type === "send-resume-error" && 
                        (<p className="alert alert-danger">{message.msg}</p>)
                    }
                    {/* buttons */}
                    {vacancyLoading && 
                    <button type="button" className={styles.buttonCloseModalDisabled}>Aguarde...</button> }
                    {!vacancyLoading && 
                    <button id="btn-close-modal" type="button" className={styles.buttonCloseModal} data-bs-dismiss="modal">Voltar</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default VacancyCard