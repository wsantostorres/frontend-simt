import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchVacancies } from "../../hooks/useFetchVacancies";

import { useAuth } from "../../contexts/AuthContext";
import { useMessage } from "../../contexts/MessageContext";

import styles from './Home.module.css';

import { RiArrowDropDownFill } from 'react-icons/ri';
import { BsSearch } from 'react-icons/bs';
import { IoExitOutline } from 'react-icons/io5';
import { CgFileDocument } from 'react-icons/cg';

import VacancyCard from "./VacancyCard";

const HomeStudent = () => {

    document.title = "Home";

    const { vacancyMessage, setVacancyMessage } = useMessage();
    const { bondType, logout, name, course } = useAuth()
    const { searchVacancies, getAllVacancies, vacancyLoading } = useFetchVacancies();

    const [vacancies, setVacancies] = useState(null);
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        (async () => {
        if(search){
            const searchResults = await searchVacancies(search, course, bondType);
            setVacancies(searchResults)
            setSearchText(search)
        }else{
            const allVacancies = await getAllVacancies(course, bondType);
            setVacancies(allVacancies)
            setSearchText("")
            setErrorMessage("")
        }
        })()
    }, [course, search, getAllVacancies, searchVacancies, setSearchText, bondType])

    useEffect(() => {
        if (vacancyMessage.type === "error") {
          setErrorMessage(vacancyMessage);
          setVacancyMessage("");
        }
      }, [vacancyMessage, setErrorMessage, setVacancyMessage]);

    const handleSearch = async(e) => {
        e.preventDefault();
      }

    const initialLetter = (name) => {
        return name[0];
    }

    const inputfocus = (e) => {
        let div = e.target.parentNode;
        div.style.borderColor = "#127822";
        div.style.outlineColor = "#127822";
        document.getElementById("iconSearch").style.color = "#127822";
    }

    const inputBlur = (e) => {
        let div = e.target.parentNode;
        div.style.borderColor = "#777";
        div.style.outlineColor  = "transparent";
        document.getElementById("iconSearch").style.color = "#777";
    }

  return (
    <div className={styles.pageHome}>
        <nav>
            <div>
                <div>
                    <Link><img src="/logo.svg" alt="Home"/></Link>
                    <form onSubmit={handleSearch} className={styles.inputSearchContainer}>
                        <button type='submit' id="iconSearch"><BsSearch /></button>
                        <input type="text" 
                        placeholder="Buscar" 
                        onFocus={inputfocus} 
                        onBlur={inputBlur} 
                        onChange={(e) => setSearch(e.target.value)} value={search}/>
                    </form>
                </div>
                <div id="btn-dropdown-user" className="dropdown">
                    <button className={styles.buttonDropdown} data-bs-toggle="dropdown" aria-expanded="false">
                        <div>{initialLetter(name)}</div>
                        <div className={styles.textDropdown}>
                            <div>{name}</div>
                            <div>{bondType}(a)</div>
                        </div>
                        <div>
                            <RiArrowDropDownFill />
                        </div>
                    </button>
                    <ul className="dropdown-menu p-3" id="dropdown">
                        <li>
                            <div className={styles.openDropdown}>
                                <div>{initialLetter(name)}</div>
                                <div>
                                    <div>{name}</div>
                                    <div>{bondType}(a)</div>
                                </div>
                            </div>
                        </li>
                        <li><hr className="dropdown-divider"/></li>
                        <li className={styles.linkProfile}>
                            <Link id="link-resume" to="/curriculo"><CgFileDocument /> Currículo</Link>
                        </li>
                        <li className={styles.buttonLogout}>
                            <button id="btn-logout" onClick={logout}><IoExitOutline /> Sair</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <main>
            <div className="mt-5">
                <h2 className="fw-bold">Todas as Vagas</h2>
                <hr />
            </div>
            {searchText && (
                <h4>Exibindo resultados para: <span>{searchText}</span></h4>
            )}
            {vacancyMessage.type === "success" && (<p className="alert alert-success mt-3 text-center">{vacancyMessage.msg } </p>)}
            {errorMessage.type === "error" && (<p className="alert alert-danger mt-3 text-center">{errorMessage.msg }</p>)}
            <div className={styles.showLoading}>
                {vacancyLoading && ( 
                    <div className="spinner-border spinner-border-sm text-success" role="status">
                        <span className="sr-only"></span>
                    </div>
                )}
            </div>
            {vacancies && vacancies.map( (vacancy) => (
                <VacancyCard key={vacancy.id} id={vacancy.id} 
                    title={vacancy.title} 
                    description={vacancy.description}  
                    date={vacancy.closingDate}
                    type={vacancy.type} 
                    morning={vacancy.morning} 
                    afternoon={vacancy.afternoon} 
                    night={vacancy.night} />
            ))}
        </main>
    </div>
  )
}

export default HomeStudent