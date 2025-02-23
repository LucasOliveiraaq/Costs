import styles from '../project/ProjectCard.module.css'
import { BsFillTrashFill } from 'react-icons/bs'

function ServiceCard({id, nome, custo, descricao, handleRemove}) {
    const remove = (e) => {
        e.preventDefault()
        handleRemove(id, custo)
    }

    return (
        <div className={styles.project_card}>
            <h4>{nome}</h4>
            <p>
                <span>Custo total:</span>R${custo}
            </p>
            <p>{descricao}</p>
            <div className={styles.project_card_actions}>
                <button onClick={remove}>
                    <BsFillTrashFill/>
                    Excluir
                </button>
            </div>
        </div>
    )
}

export default ServiceCard