import { useParams } from "react-router-dom";
import styles from "./Project.module.css";
import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";
import Loading from "../layout/Loading";
import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import Message from "../layout/Message";
import ServiceForm from "../Service/ServiceForm";
import { parse, v4 as uuidv4 } from "uuid";
import ServiceCard from "../Service/ServiceCard";

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    setTimeout(() => {
      fetch(`${API_BASE_URL}/projetos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log("Dados do projeto recebidos: ", data.data);
          setProject(data.data);
          setServices(data.data.servicos);
        })
        .catch((err) => console.log);
    }, 300);
  }, [id]);

  function editPost(project) {
    setMessage("");

    fetch(`${API_BASE_URL}/projetos/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.json().then((errorData) => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        return resp.json();
      })
      .then((data) => {
        setProject(data.data);
        setShowProjectForm(!showProjectForm);
        setMessage(data.message);
        setType(data.type);
      })
      .catch((error) => {
        try {
          const errorData = JSON.parse(error.message);
          setMessage(errorData.message || "Erro ao atualizar o projeto");
          setType(errorData.type || "error");
        } catch (e) {
          // Caso o erro não seja um JSON válido
          setMessage("Erro ao atualizar o projeto");
          setType("error");
        }
      });
  }

  function createService(project) {
    setMessage("");

    if (!project.servicos || project.servicos.length === 0) {
      setMessage("Erro ao adicionar serviço: Nenhum serviço encontrado.");
      setType("error");
      return;
    }

    const lastService = project.servicos[project.servicos.length - 1];
    const lastServiceCost = parseFloat(lastService.custo);

    const newCost = parseFloat(project.custo) + lastServiceCost;

    if (newCost > parseFloat(project.orcamento)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço.");
      setType("error");
      return;
    }

    fetch(`${API_BASE_URL}/servicos?projetoId=${project.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projetoId: project.id,
        nome: lastService.nome,
        custo: lastService.custo,
        descricao: lastService.descricao,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Resposta da API:", data);
        if (data && data.data) {
          console.log("Serviço cadastrado:", data.data);
          setServices((prevServices) => [...prevServices, data.data]);
          setShowServiceForm(false);
          setMessage("Serviço adicionado com sucesso!");
          setType("success");
        } else {
          setMessage("Erro ao adicionar serviço: resposta inválida da API.");
          setType("error");
        }
      });
  }

  function removeService(id) {
    fetch(`${API_BASE_URL}/servicos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then(() => {
        setServices(services.filter((service) => service.id !== id));
        setMessage("Serviço removido com sucesso!");
        setType("success");
      })
      .catch(() => {
        setMessage("Erro ao remover serviço.");
        setType("error");
      });
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  return (
    <>
      {project.nome ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {message && <Message type={type} msg={message} />}
            <div className={styles.details_container}>
              <h1>Projeto: {project.nome}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? "Editar projeto" : "Fechar"}
              </button>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria:</span>
                    {project.categoria.nome}
                  </p>
                  <p>
                    <span>Total de Orçamento:</span>R${project.orcamento}
                  </p>
                  <p>
                    <span>Total Utilizado:</span>R${project.custo}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir Edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar Serviço"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 && (
                <>
                  {console.log("Lista de serviços:", services)}
                  {services.map((service) => (
                    <ServiceCard
                      id={service.id}
                      nome={service.nome}
                      custo={service.custo}
                      descricao={service.descricao}
                      key={service.id}
                      handleRemove={removeService}
                    />
                  ))}
                </>
              )}
              {services.length === 0 && <p>Não há serviços cadastrados.</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
