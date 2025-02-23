import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from "../layout/Message";
import Container from "../layout/Container";
import LinkButton from "../layout/LinkButton";
import styles from "../pages/Projects.module.css";
import ProjectCard from "../project/ProjectCard";
import API_BASE_URL from "../../config/apiConfig";
import Loading from "../layout/Loading";

function Projects() {
  const location = useLocation();
  const message = location.state?.message || "";
  const type = location.state?.type || "";

  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState('')

  useEffect(() => {
    setTimeout(() => {
      fetch(`${API_BASE_URL}/projetos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          setProjects(data.data);
          setRemoveLoading(true);
        })
        .catch((err) => console.log(err));
    }, 300);
  }, []);

  function removeProject(id) {
    fetch(`${API_BASE_URL}/projetos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(projects.filter((project) => project.id !== id))
        setProjectMessage(data.message)
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      {message && <Message type={type} msg={message} />}{" "}
      {projectMessage && <Message type="success" msg={projectMessage} />}{" "}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              id={project.id}
              name={project.nome}
              bugdet={project.orcamento}
              category={project.categoria.nome}
              key={project.id}
              handleRemove={removeProject}
            />
          ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>Não há projetos cadastrados!</p>
        )}
      </Container>
    </div>
  );
}

export default Projects;
