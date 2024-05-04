import { AddIcon } from "../../../assets/icons/IconsSet"

function AdreassContent() {
    console.log('teste')

    return (
        <div className="d-flex justify-content-between">
            <h4>Meus Endereços</h4>

            <a type="button" className=" text-decoration-none ">
                <AddIcon />
                <span className="ms-2">Adicionar novo Enndereço</span>
            </a>

        </div>
    );
}

export default AdreassContent