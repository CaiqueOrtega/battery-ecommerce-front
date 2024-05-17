export default function Footer() {
    return (
        <div className="text-center">
            <hr />
            <a type="#" className="m-3 ">Termos e Condições</a>
            <div className="p-3 fw-light lh-sm">
                <p className="text-secondary mt-2 small fw-light">Copyright © 2024: <span className="ms-3"> A.O.BA | Alavarse Ortega BaseTech </span></p>
                <p className="text-secondary mt-2 small fw-light">CNPJ: n.º 27.414.171/0001-13 | Endereço: Av. América, n.º 1461,
                    Sala 01, Zona 06, Cianorte-PR, CEP: 87.205-076</p>
                <p className="text-secondary mt-2 small fw-light"><a type="button" className="text-primary fw-light" onClick={() => window.open('https://api.whatsapp.com/send?phone=5544999251012&text=Olá%2C+gostaria+de+saber+mais+sobre+as+baterias!', 'blank')}
                >Fale com a gente</a>  | MacDavis Motos: Empresa parceira Baterias Jupiter</p>
            </div>
        </div>
    )
}