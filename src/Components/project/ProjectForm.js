import { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";

import Input from "../form/InputTemp";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";
import styles from "./ProjectForm.module.css";

function ProjectForm({ handleSubmit, btnText, projectData }) {
  const [categories, setCategories] = useState([]);
  const [project, setProject] = useState(projectData || {});

  useEffect(() => {
    fetch(`${API_BASE_URL}/categorias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.text()) 
      .then((data) => {
        console.log("Resposta bruta da API:", data); 

        try {
          const jsonData = JSON.parse(data);
          setCategories(jsonData);
        } catch (error) {
          console.error("Erro ao converter JSON:", error);
        }
      })
      .catch((err) => console.log("Erro ao buscar categorias:", err));
  }, [projectData]);

  const submit = (e) => {
    e.preventDefault();
    //console.log(project)
    handleSubmit(project);
  };

  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value });
  }

  function handleCategory(e) {
    const selectedCategoryId = e.target.value;
    const selectedCategoryName = e.target.options[e.target.selectedIndex].text;

    setProject((prevProject) => ({
      ...prevProject,
      categoria: {
        id: selectedCategoryId,
        nome: selectedCategoryName,
      },
    }));

    console.log(
      "Categoria selecionada:",
      selectedCategoryId,
      selectedCategoryName
    );
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do projeto"
        name="nome"
        placeholder="Insira o nome do projeto"
        handleOnChange={handleChange}
        value={project.nome}
      />
      <Input
        type="number"
        text="Orçamento do projeto"
        name="orcamento"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange}
        value={project.orcamento}
      />
      <Select
        name="categoria_id"
        text="Selecione a categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.categoria ? project.categoria.id : ""}
      />
      <SubmitButton text={btnText} />
    </form>
  );
}

export default ProjectForm;
