import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchVacancies } from "../../hooks/useFetchVacancies";

import { useAuth } from "../../contexts/AuthContext";
import { useMessage } from "../../contexts/MessageContext";

import styles from './HomeServer.module.css';

import { RiArrowDropDownFill } from 'react-icons/ri';
import { BsSearch } from 'react-icons/bs';
import { IoExitOutline } from 'react-icons/io5';
import { BsPlusLg } from 'react-icons/bs';
import { BsArrow90DegUp } from 'react-icons/bs';

import VacancyCard from "../../components/VacancyCard";

const HomeServer = () => {

    document.title = "Home";

    const { vacancyMessage, setVacancyMessage } = useMessage();
    const { bondType, logout, name } = useAuth()
    const { searchVacancies, getAllVacancies, vacancyLoading } = useFetchVacancies();

    const [vacancies, setVacancies] = useState(null);
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        (async () => {
        if(search){
            const searchResults = await searchVacancies(search);
            setVacancies(searchResults)
            setSearchText(search)
        }else{
            const allVacancies = await getAllVacancies();
            setVacancies(allVacancies)
            setSearchText("")
            setErrorMessage("")
        }
        })()
    }, [search, getAllVacancies, searchVacancies, setSearchText])

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
    }

    const inputBlur = (e) => {
        let div = e.target.parentNode;
        div.style.borderColor = "#777";
        div.style.outlineColor  = "transparent";
    }

    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  return (
    <div className={styles.pageServer}>
        <nav>
            <div>
                <div>
                    <Link><img src="/logo.svg" alt="Home"/></Link>
                    <form onSubmit={handleSearch} className={styles.inputSearchContainer}>
                        <button type='submit'><BsSearch /></button>
                        <input type="text" 
                        placeholder="Buscar" 
                        onFocus={inputfocus} 
                        onBlur={inputBlur} 
                        onChange={(e) => setSearch(e.target.value)} value={search}/>
                    </form>
                </div>
                <div>
                    <Link to="/publicacao"> <BsPlusLg/> <span>Nova Publicação</span></Link>
                    <div className="dropdown ">
                        <button className={styles.dropdownUserLogged} data-bs-toggle="dropdown" aria-expanded="false">
                            <div>{initialLetter(name)}</div>
                            <div className={styles.dataUserLogged}>
                                <div>{name}</div>
                                <div>{bondType}(a)</div>
                            </div>
                            <div>
                                <RiArrowDropDownFill />
                            </div>
                        </button>
                        <ul className="dropdown-menu p-3" id="dropdown">
                            <li>
                                <div className={styles.detailsDropdownUserLogged}>
                                    <div>{initialLetter(name)}</div>
                                    <div>
                                        <div>{name}</div>
                                        <div>{bondType}(a)</div>
                                    </div>
                                </div>
                            </li>
                            <li><hr className="dropdown-divider"/></li>
                            <li className={styles.buttonLogout}>
                                <button onClick={logout}><IoExitOutline /> Sair</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        <main id="top">
            {searchText && (
                <h4>Exibindo resultados para: <span>{searchText}</span></h4>
            )}
            {vacancyMessage.type === "success" && (<p className="alert alert-success mt-3 mb-0 text-center">{vacancyMessage.msg } </p>)}
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
                    title={vacancy.titulo} 
                    description={vacancy.descricao}  
                    date={vacancy.dataEncerramento}
                    type={vacancy.tipo} 
                    morning={vacancy.dispManha} 
                    afternoon={vacancy.dispTarde} 
                    night={vacancy.dispNoite} />
            ))}
            <button type="button" className={styles.buttonBackToTop} onClick={backToTop}><BsArrow90DegUp/></button>
        </main>
    </div>
  )
}

export default HomeServer