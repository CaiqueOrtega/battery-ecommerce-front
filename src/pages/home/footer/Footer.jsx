export default function Footer() {
    return (
        <>
            <hr />
            <a type="#" className="m-3">Termos e Condições</a>
            <div className="p-3 fs-6 fw-light  lh-sm">
                <p className="text-secondary mt-2 fs-6 fw-light">Copyright © 2024 ...</p>
                <p className="text-secondary mt-2 fs-6 fw-light">CNPJ: n.º 27.414.171/0001-13 | Endereço: Av. América, n.º 1461,
                    Sala 01, Zona 06, Cianorte-PR, CEP: 87.205-076</p>
                <p className="text-secondary mt-2 fs-6 fw-light"><a type="button" className="text-primary fw-light" onClick={() => window.location.href = 'https://api.whatsapp.com/send?phone=5544999251012'}
                >Fale com a gente</a>  | MacDavis Motos: Empresa parceira Baterias Jupiter</p>
            </div>
        </>
    )
}