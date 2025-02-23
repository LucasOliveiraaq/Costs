import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";
import ProjectForm from "../project/ProjectForm";
import styles from "./NewProject.module.css";

function NewProject() {
  const history = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  function createPost(project) {
    fetch(`${API_BASE_URL}/projetos`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then(async (resp) => {
        const data = await resp.json();
        console.log("Resposta da API:", data); // Verifica o retorno

        if (!resp.ok) {
          throw new Error(data.message); // Lançando erro correto
        }

        // Enviando a mensagem e o tipo corretos para a página de projetos
        history("/projects", { state: { message: data.message, type: data.type } });
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setErrorMessage(err.message);
      });
}


  return (
    <div className={styles.newproject_container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
}

export default NewProject;
