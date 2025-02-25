import styles from "../project/ProjectForm.module.css";
import { useState } from "react";
import Input from "../form/InputTemp";
import SubmitButton from "../form/SubmitButton";

function ServiceForm({handleSubmit, btnText, projectData}) {

  const[service, setService] = useState({})

  const submit = (e) => {
    e.preventDefault()
    projectData.servicos.push(service)
    handleSubmit(projectData)
  }

  function handleChange(e) {
    setService({ ...service, [e.target.name]: e.target.value });
  }
  

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do serviço"
        name="nome"
        placeholder="Insira o nome do serviço"
        handleOnChange={handleChange}
      />
      <Input
        type="number"
        text="Custo do serviço"
        name="custo"
        placeholder="Insira o nome do serviço"
        handleOnChange={handleChange}
      />
      <Input
        type="text"
        text="Descrição do projeto"
        name="descricao"
        placeholder="Descreva o serviço"
        handleOnChange={handleChange}
      />
      <SubmitButton text={btnText}/>
    </form>
  );
}

export default ServiceForm;
