import { Container } from "react-bootstrap";

export function SuccessAnimation({ message }) {
    return (
            <div className="text-center" style={{width: 100 }}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.8 130.8">
                    <circle className="path circle" fill="none" stroke="#58af9b" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                    <polyline className="path check" fill="none" stroke="#58af9b" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                </svg>

                <style jsx>{`
                .path {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 0;
                }
                .path.circle {
                    animation: dash 0.9s ease-in-out;
                }
                .path.line {
                    stroke-dashoffset: 1000;
                    animation: dash 0.95s 0.35s ease-in-out forwards;
                }
                .path.check {
                    stroke-dashoffset: -100;
                    animation: dash-check 0.95s 0.35s ease-in-out forwards;
                }
                @keyframes dash {
                    0% {
                        stroke-dashoffset: 1000;
                    }
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes dash-check {
                    0% {
                        stroke-dashoffset: -100;
                    }
                    100% {
                        stroke-dashoffset: 900;
                    }
                }
            `}</style>
            </div>
    );
}

export function ErrorAnimation({ message }) {
    return (
            <div className="text-center" style={{maxWidth: 150}}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                    <circle className="path circle" fill="none" stroke="#db3646" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                    <line className="path line" fill="none" stroke="#db3646" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                    <line className="path line" fill="none" stroke="#db3646" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                </svg>
                <h4 className="text-danger mt-3">Opss!</h4>
                <p className="mt-3 text-danger" id="errorMsg">{message}</p>
                <style jsx>{`
                .path {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 0;
                }
                .path.circle {
                    animation: dash 0.9s ease-in-out;
                }
                .path.line {
                    stroke-dashoffset: 1000;
                    animation: dash 0.95s 0.35s ease-in-out forwards;
                }
                @keyframes dash {
                    0% {
                        stroke-dashoffset: 1000;
                    }
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
            </div>
    );
}
