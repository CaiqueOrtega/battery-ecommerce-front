export const SearchIcon = ({ currentColor, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z" fill={"#" + currentColor} />
    </svg>
);

export const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
            strokeWidth="0.2"
            stroke="currentColor"
        />
    </svg>

);

export const UserCircleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
    </svg>

);

export const CarretUpIcon = ({ className }) => (
    <svg className={className} fill="#ffffff" width="25px" height="25px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)">
        <path d="M213.65674,101.657l-80,79.99976a7.99945,7.99945,0,0,1-11.31348,0l-80-79.99976A8,8,0,0,1,48,88H208a8,8,0,0,1,5.65674,13.657Z"></path>
    </svg>
);

export const UserCircleOutlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 256 256">
        <g fill="none" fillRule="nonzero">
            <g transform="scale(4)">
                <circle cx="32" cy="32" r="30" fill="#ebebed"></circle>
                <path d="M32,62c-9.22825,-0.02959 -17.93506,-4.28254 -23.6313,-11.543c5.66443,-7.28904 14.4003,-11.5244 23.6313,-11.457c9.22899,-0.05587 17.95879,4.1847 23.62,11.4736c-5.69755,7.2506 -14.3987,11.4967 -23.62,11.5264z" fill="#d0d3d8"></path>
                <circle cx="32" cy="22" r="11" fill="#d0d3d8"></circle>
                <path d="M32,1c-17.12083,0 -31,13.87917 -31,31c0,17.12083 13.87917,31 31,31c17.12083,0 31,-13.87917 31,-31c-0.01934,-17.11281 -13.88719,-30.98066 -31,-31zM32,61c-16.01626,0 -29,-12.98374 -29,-29c0,-16.01626 12.98374,-29 29,-29c16.01626,0 29,12.98374 29,29c-0.01824,16.0087 -12.9913,28.98176 -29,29z" fill="#f11100"></path>
                <path d="M53.5874,46.7529c-12.02561,-11.67054 -31.14919,-11.67054 -43.1748,0c-0.39167,0.38585 -0.39838,1.01553 -0.01502,1.40964c0.38336,0.39411 1.01299,0.40481 1.40952,0.02396c11.24933,-10.91531 29.13647,-10.91531 40.3858,0c0.39653,0.38086 1.02616,0.37016 1.40952,-0.02396c0.38336,-0.39411 0.37665,-1.02379 -0.01502,-1.40964z" fill="#f11100"></path>
                <path d="M32,34c6.62742,0 12,-5.37258 12,-12c0,-6.62742 -5.37258,-12 -12,-12c-6.62742,0 -12,5.37258 -12,12c0.00738,6.62436 5.37564,11.99262 12,12zM32,12c5.52285,0 10,4.47715 10,10c0,5.52285 -4.47715,10 -10,10c-5.52285,0 -10,-4.47715 -10,-10c0.00628,-5.52024 4.47976,-9.99372 10,-10z" fill="#f11100"></path>
            </g>
        </g>
    </svg>
);

export const LockIcon = ({ className, currentColor }) => (
    <svg className={className} fill={'#' + currentColor} height="18" width="18" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M418.4,232.7h-23.3v-93.1C395.1,62.5,332.6,0,255.5,0S115.9,62.5,115.9,139.6v93.1H92.6c-12.8,0-23.3,10.4-23.3,23.3v232.7 c0,12.9,10.4,23.3,23.3,23.3h325.8c12.8,0,23.3-10.4,23.3-23.3V256C441.7,243.1,431.2,232.7,418.4,232.7z M348.6,232.7H162.4v-93.1 c0-51.4,41.7-93.1,93.1-93.1s93.1,41.7,93.1,93.1V232.7z"></path> </g></svg>
);

export const EnvelopeIcon = ({ className, currentColor }) => (
    <svg className={className} height="18" width="18" viewBox="0 -3 24 24" id="meteor-icon-kit__solid-envelope" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M23.4006 1.20046L13.1469 8.9765C12.4583 9.4585 11.5417 9.4585 10.8531 8.9765L0.599433 1.20046C1.14673 0.47153 2.0183 0 3 0H21C21.9817 0 22.8533 0.47153 23.4006 1.20046zM24 3.25413V15C24 16.6569 22.6569 18 21 18H3C1.34315 18 0 16.6569 0 15V3.25413L9.70615 10.615C11.0834 11.5791 12.9166 11.5791 14.2938 10.615L24 3.25413z" fill={'#' + currentColor}></path></g></svg>
);

export const UserIcon = ({ className, currentColor, size }) => (
    <svg className={className} width={size + 'px'} height={size + 'px'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" fill={'#' + currentColor}></circle> <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" fill={'#' + currentColor}></path> </g></svg>
);

export const DocumentIcon = ({ className, currentColor }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill={'#' + currentColor} viewBox="0 0 16 16">
        <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
        <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
    </svg>
);

export const LoginIcon = ({ currentColor }) => (
    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.1633 4.09295L15.0612 2.17072C14.1429 1.86721 13.2245 1.96838 12.5102 2.47423C12.2041 2.67657 12 2.87891 11.7959 3.08125H7.91837C6.38776 3.08125 5.06122 4.39646 5.06122 5.91401V6.9257C5.06122 7.33038 5.36735 7.73506 5.87755 7.73506C6.38776 7.73506 6.69388 7.33038 6.69388 6.9257V5.91401C6.69388 5.20582 7.30612 4.69997 7.91837 4.69997H11.2857V19.3696H7.91837C7.20408 19.3696 6.69388 18.7626 6.69388 18.1555V17.1439C6.69388 16.7392 6.38776 16.3345 5.87755 16.3345C5.36735 16.3345 5.06122 16.638 5.06122 17.0427V18.0544C5.06122 19.5719 6.28572 20.8871 7.91837 20.8871H11.7959C12 21.0895 12.2041 21.393 12.4082 21.4942C12.9184 21.7977 13.4286 22 14.0408 22C14.3469 22 14.7551 21.8988 15.0612 21.7977L20.1633 19.8754C21.2857 19.4708 22 18.4591 22 17.245V6.62219C22 5.50933 21.1837 4.39646 20.1633 4.09295Z" fill={'#' + currentColor}></path> <path d="M6.38776 13.5017C6.08163 13.8052 6.08163 14.3111 6.38776 14.6146C6.4898 14.7158 6.69388 14.8169 6.89796 14.8169C7.10204 14.8169 7.30612 14.7158 7.40816 14.6146L9.44898 12.5912C9.55102 12.49 9.55102 12.3889 9.65306 12.3889C9.65306 12.2877 9.7551 12.1865 9.7551 12.0854C9.7551 11.9842 9.7551 11.883 9.65306 11.7819C9.65306 11.6807 9.55102 11.5795 9.44898 11.5795L7.40816 9.55612C7.10204 9.25261 6.59184 9.25261 6.28571 9.55612C5.97959 9.85963 5.97959 10.3655 6.28571 10.669L7 11.3772H2.81633C2.40816 11.3772 2 11.6807 2 12.1865C2 12.6924 2.30612 12.9959 2.81633 12.9959H7.10204L6.38776 13.5017Z" fill={'#' + currentColor}></path> </g></svg>
);

export const SingUpIcon = ({ currentColor }) => (
    <svg width="25px" height="25px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M526.628571 512L190.171429 285.257143l343.771428-219.428572 336.457143 219.428572z" fill={'#' + currentColor}></path><path d="M526.628571 541.257143c-7.314286 0-7.314286 0-14.628571-7.314286L175.542857 307.2c-7.314286 0-7.314286-14.628571-7.314286-21.942857 0-7.314286 7.314286-14.628571 14.628572-21.942857L519.314286 36.571429c7.314286-7.314286 21.942857-7.314286 29.257143 0l343.771428 219.428571c7.314286 7.314286 14.628571 14.628571 14.628572 21.942857 0 7.314286-7.314286 14.628571-14.628572 21.942857L541.257143 533.942857s-7.314286 7.314286-14.628572 7.314286zM241.371429 285.257143l285.257142 190.171428 292.571429-190.171428-292.571429-190.171429-285.257142 190.171429z" fill={'#' + currentColor}></path><path d="M526.628571 716.8L124.342857 446.171429c-14.628571-7.314286-21.942857-29.257143-7.314286-36.571429 7.314286-14.628571 21.942857-14.628571 36.571429-7.314286L533.942857 658.285714l394.971429-256c14.628571-7.314286 29.257143-7.314286 36.571428 7.314286s7.314286 29.257143-7.314285 36.571429L526.628571 716.8z" fill={'#' + currentColor}></path><path d="M526.628571 877.714286L124.342857 607.085714c-14.628571-7.314286-21.942857-21.942857-7.314286-36.571428 7.314286-14.628571 21.942857-14.628571 36.571429-7.314286l380.342857 256 394.971429-256c14.628571-7.314286 29.257143-7.314286 36.571428 7.314286 7.314286 14.628571 7.314286 29.257143-7.314285 36.571428L526.628571 877.714286z" fill={'#' + currentColor}></path></g></svg>
);

export const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f11100" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
    </svg>
);

export const AtomIcon = () => (
    <svg fill="currentcolor" height="22px" width="22px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 469.863 469.863" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M407.82,260.136c-7.237-8.363-15.384-16.795-24.307-25.204c8.923-8.409,17.07-16.841,24.307-25.204 c15.082-17.429,25.56-33.779,31.143-48.597c6.455-17.133,6.262-31.824-0.574-43.665s-19.462-19.354-37.527-22.33 c-15.626-2.574-35.024-1.675-57.658,2.672c-10.861,2.086-22.237,4.925-33.981,8.448c-2.568-10.863-5.478-21.17-8.713-30.815 c5.027-4.79,8.169-11.54,8.169-19.015c0-14.49-11.789-26.278-26.278-26.278c-0.95,0-1.887,0.053-2.811,0.152 c-2.129-3.23-4.313-6.23-6.556-8.965C261.423,7.178,248.604,0,234.931,0S208.44,7.178,196.83,21.335 c-10.041,12.244-18.962,29.494-26.515,51.269c-3.624,10.449-6.853,21.72-9.674,33.652c-11.744-3.523-23.12-6.363-33.981-8.448 c-22.635-4.347-42.034-5.246-57.658-2.672c-18.065,2.976-30.691,10.489-37.527,22.33s-7.029,26.532-0.574,43.665 c5.583,14.818,16.061,31.168,31.143,48.597c7.237,8.363,15.384,16.795,24.307,25.204c-5.352,5.043-10.427,10.095-15.189,15.135 c-2.454-0.76-5.061-1.171-7.762-1.171c-14.49,0-26.278,11.789-26.278,26.278c0,4.938,1.371,9.561,3.749,13.511 c-4.221,6.944-7.555,13.64-9.97,20.048c-6.456,17.133-6.262,31.823,0.574,43.664s19.462,19.354,37.527,22.33 c5.798,0.955,12.115,1.432,18.925,1.432c11.541,0,24.498-1.37,38.732-4.104c10.861-2.086,22.237-4.925,33.981-8.448 c2.821,11.933,6.05,23.204,9.674,33.653c7.553,21.775,16.474,39.024,26.515,51.269c11.61,14.157,24.429,21.335,38.102,21.335 s26.492-7.178,38.102-21.335c10.041-12.244,18.962-29.494,26.516-51.269c3.624-10.449,6.853-21.72,9.674-33.653 c10.344,3.103,20.401,5.675,30.072,7.668c2.688,11.654,13.142,20.372,25.601,20.372c10.723,0,19.961-6.459,24.042-15.688 c4.18-0.218,8.172-0.614,11.923-1.232c18.065-2.976,30.691-10.489,37.527-22.33s7.029-26.531,0.574-43.664 C433.38,293.916,422.902,277.565,407.82,260.136z M346.975,117.449c38.507-7.395,66.204-3.649,74.093,10.017 c7.89,13.666-2.716,39.526-28.372,69.175c-7.133,8.243-15.208,16.569-24.098,24.88c-14.387-12.364-30.353-24.571-47.525-36.323 c-1.592-20.747-4.18-40.677-7.694-59.319C325.022,122.335,336.27,119.505,346.975,117.449z M268.942,293.839 c-11.333,6.543-22.705,12.656-34.01,18.302c-11.306-5.646-22.677-11.759-34.01-18.302c-11.333-6.543-22.313-13.335-32.855-20.303 c-0.763-12.614-1.155-25.518-1.155-38.605s0.392-25.991,1.155-38.605c10.542-6.968,21.522-13.759,32.855-20.303 c11.333-6.543,22.705-12.656,34.01-18.302c11.306,5.646,22.677,11.759,34.01,18.302c11.333,6.543,22.313,13.335,32.855,20.303 c0.763,12.614,1.155,25.518,1.155,38.605s-0.392,25.991-1.155,38.605C291.255,280.505,280.276,287.296,268.942,293.839z M299.746,298.634c-1.399,13.505-3.246,26.554-5.518,39.003c-11.916-4.257-24.141-9.182-36.536-14.723 c7.087-3.754,14.178-7.672,21.25-11.754C286.014,307.077,292.952,302.895,299.746,298.634z M212.171,322.914 c-12.395,5.541-24.62,10.466-36.536,14.723c-2.271-12.448-4.119-25.498-5.518-39.003c6.795,4.261,13.733,8.443,20.804,12.526 C197.993,315.242,205.084,319.16,212.171,322.914z M147.356,259.211c-10.996-7.964-21.373-16.089-31.018-24.28 c9.645-8.191,20.023-16.316,31.018-24.28c-0.293,8.015-0.445,16.115-0.445,24.28S147.064,251.197,147.356,259.211z M170.117,171.229c1.399-13.504,3.246-26.554,5.518-39.003c11.916,4.257,24.141,9.182,36.536,14.723 c-7.087,3.754-14.178,7.672-21.25,11.754C183.85,162.786,176.912,166.969,170.117,171.229z M257.692,146.949 c12.395-5.541,24.62-10.466,36.536-14.723c2.271,12.448,4.119,25.498,5.518,39.003c-6.795-4.261-13.733-8.443-20.804-12.526 C271.871,154.621,264.78,150.703,257.692,146.949z M322.507,210.652c10.996,7.964,21.373,16.089,31.018,24.28 c-9.645,8.191-20.023,16.316-31.018,24.28c0.293-8.015,0.445-16.115,0.445-24.28S322.8,218.667,322.507,210.652z M189.21,79.158 C202.059,42.115,219.151,20,234.931,20c8.926,0,18.272,7.081,27.032,19.932c-3.65,4.513-5.842,10.251-5.842,16.494 c0,14.305,11.491,25.969,25.727,26.265c3.088,9.303,5.861,19.264,8.302,29.777c-17.901,6.278-36.455,14.001-55.219,22.996 c-18.764-8.995-37.318-16.718-55.219-22.996C182.465,100.614,185.638,89.457,189.21,79.158z M77.167,196.641 c-25.656-29.649-36.262-55.509-28.372-69.175c5.222-9.045,19.12-13.744,39.087-13.744c10.2,0,21.986,1.227,35.006,3.727 c10.705,2.056,21.953,4.886,33.596,8.429c-3.514,18.642-6.102,38.572-7.694,59.319c-17.172,11.752-33.137,23.959-47.525,36.323 C92.376,213.21,84.3,204.884,77.167,196.641z M122.889,352.414c-38.504,7.396-66.203,3.65-74.093-10.017 c-5.323-9.219-2.216-23.992,8.237-41.729c2.04,0.51,4.171,0.784,6.367,0.784c14.49,0,26.278-11.789,26.278-26.279 c0-4.45-1.116-8.643-3.076-12.321c4.598-4.829,9.489-9.672,14.664-14.511c14.387,12.364,30.353,24.57,47.524,36.323 c1.592,20.748,4.18,40.677,7.694,59.319C144.842,347.528,133.594,350.358,122.889,352.414z M280.653,390.705 c-12.849,37.043-29.941,59.158-45.721,59.158s-32.872-22.115-45.721-59.158c-3.572-10.299-6.745-21.455-9.498-33.31 c17.901-6.278,36.455-14.001,55.219-22.996c18.764,8.995,37.318,16.718,55.219,22.996 C287.398,369.25,284.225,380.406,280.653,390.705z M421.068,342.397c-4.547,7.876-15.683,12.45-31.666,13.502 c-3.809-9.823-13.354-16.81-24.507-16.81c-9.414,0-17.684,4.979-22.325,12.439c-9.373-1.957-19.134-4.483-29.191-7.544 c3.514-18.642,6.102-38.572,7.694-59.319c17.172-11.752,33.137-23.958,47.524-36.323c8.89,8.311,16.965,16.637,24.098,24.88 C418.352,302.872,428.958,328.731,421.068,342.397z"></path> <path d="M234.931,193.433c-22.882,0-41.498,18.616-41.498,41.499s18.616,41.499,41.498,41.499s41.499-18.616,41.499-41.499 S257.814,193.433,234.931,193.433z M234.931,256.43c-11.854,0-21.498-9.644-21.498-21.499s9.644-21.499,21.498-21.499 c11.854,0,21.499,9.644,21.499,21.499S246.786,256.43,234.931,256.43z"></path> </g> </g></svg>
);

export const UserIconCropped = () => (
    <svg height="22px" width="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" stroke="currentcolor" strokeWidth="1.5"></circle> <path d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
);

export const PromotionIcon = () => (
    <svg fill="currentcolor" width="22px" height="22px" viewBox="0 0 30.00 30.00" xmlns="http://www.w3.org/2000/svg" stroke="currentcolor" strokeWidth="0.9999999999999999"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M8.5 17h9c.277 0 .5.223.5.5s-.223.5-.5.5h-9c-.277 0-.5-.223-.5-.5s.223-.5.5-.5zm4.5 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 1c.558 0 1 .442 1 1s-.442 1-1 1-1-.442-1-1 .442-1 1-1zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 1c.558 0 1 .442 1 1s-.442 1-1 1-1-.442-1-1 .442-1 1-1zM25 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 1c.558 0 1 .442 1 1s-.442 1-1 1-1-.442-1-1 .442-1 1-1zM.446 15.67c-.587.58-.583 1.542 0 2.124l11.76 11.76c.58.582 1.542.587 2.123 0L28.855 14.85c.247-.25.532-.48.768-.856.235-.376.376-.87.376-1.544V1.5c0-.823-.678-1.5-1.5-1.5h-11c-1.158 0-1.824.624-2.35 1.145zm.703.712L15.85 1.856c.533-.526.808-.856 1.65-.856H28.5c.285 0 .5.214.5.5v10.952c0 .547-.093.805-.224 1.013-.13.21-.344.394-.63.684l-14.53 14.7c-.197.2-.5.2-.703-.002l-11.76-11.76c-.203-.203-.205-.508-.004-.706z"></path></g></svg>
);

export const DeliveryIcon = () => (
    <svg fill="currentcolor" height="28px" width="28px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-15.36 -15.36 542.72 542.72" xmlSpace="preserve" stroke="currentcolor" strokeWidth="10.24"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M401.067,366.933c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2c28.237,0,51.2-22.963,51.2-51.2 C452.267,389.897,429.303,366.933,401.067,366.933z M401.067,452.267c-18.825,0-34.133-15.309-34.133-34.133 c0-18.825,15.309-34.133,34.133-34.133c18.825,0,34.133,15.309,34.133,34.133C435.2,436.958,419.891,452.267,401.067,452.267z"></path> </g> </g> <g> <g> <path d="M110.933,366.933c-28.237,0-51.2,22.963-51.2,51.2c0,28.237,22.963,51.2,51.2,51.2s51.2-22.963,51.2-51.2 C162.133,389.897,139.17,366.933,110.933,366.933z M110.933,452.267c-18.825,0-34.133-15.309-34.133-34.133 C76.8,399.309,92.109,384,110.933,384s34.133,15.309,34.133,34.133C145.067,436.958,129.758,452.267,110.933,452.267z"></path> </g> </g> <g> <g> <path d="M510.925,294.519l-42.667-76.8c-1.502-2.705-4.361-4.386-7.458-4.386H358.4c-4.71,0-8.533,3.823-8.533,8.533v128H332.8 c0-64.435,0-179.2,0-179.2c0-18.825-15.309-34.133-34.133-34.133H187.733c0-51.755-42.112-93.867-93.867-93.867 C42.112,42.667,0,84.779,0,136.533c0,13.875,3.106,27.017,8.533,38.878v165.922c-4.71,0-8.533,3.823-8.533,8.533v42.667 c0,2.27,0.896,4.437,2.5,6.042c2.517,2.5,2.509,2.492,36.028,2.466c3.61,0,6.827-2.287,8.03-5.692 c9.626-27.204,35.499-45.483,64.375-45.483c28.894,0,54.758,18.287,64.384,45.508c1.203,3.413,4.429,5.692,8.047,5.692h140.902 c4.71,0,8.533-3.823,8.533-8.533c0-0.008,0-0.026,0-0.043c0-0.529,0-10.394,0-25.557h19.994c1.954,0,3.849-0.674,5.367-1.903 c12.262-9.924,27.093-15.164,42.906-15.164c28.894,0,54.758,18.287,64.384,45.508c1.203,3.413,4.429,5.692,8.047,5.692h29.969 c4.71,0,8.533-3.823,8.533-8.533v-93.867C512,297.216,511.633,295.791,510.925,294.519z M93.867,59.733 c42.342,0,76.8,34.458,76.8,76.8s-34.458,76.8-76.8,76.8c-42.342,0-76.8-34.458-76.8-76.8S51.524,59.733,93.867,59.733z M189.167,384c-13.474-30.865-44.177-51.2-78.234-51.2c-34.048,0-64.742,20.326-78.225,51.183c-4.437,0-10.641,0.008-15.642,0.017 v-25.6c4.71,0,8.533-3.823,8.533-8.533v-25.6h8.533c4.71,0,8.533-3.823,8.533-8.533s-3.823-8.533-8.533-8.533H25.6V200.755 C42.735,218.957,66.961,230.4,93.867,230.4c45.926,0,84.181-33.178,92.237-76.8h112.563c9.412,0,17.067,7.654,17.067,17.067 v187.204c0,0.188,0,0.341,0,0.529c0,11.213,0.009,19.507,0.162,25.6H189.167z M401.067,230.4h54.716l33.186,59.733h-87.902V230.4z M494.933,324.267H486.4c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h8.533V384H479.3 c-13.474-30.865-44.177-51.2-78.234-51.2c-11.793,0-23.433,2.475-34.133,7.134V230.4H384v68.267c0,4.71,3.823,8.533,8.533,8.533 h102.4V324.267z"></path> </g> </g> <g> <g> <path d="M134.033,104.9c-3.337-3.337-8.73-3.337-12.066,0l-53.7,53.7l-11.034-11.034c-3.337-3.337-8.73-3.337-12.066,0 c-3.337,3.336-3.337,8.73,0,12.066L62.234,176.7c1.664,1.664,3.849,2.5,6.033,2.5c2.185,0,4.369-0.836,6.033-2.5l59.733-59.733 C137.37,113.63,137.37,108.237,134.033,104.9z"></path> </g> </g> </g></svg>
);

export const StatisticsIcon = () => (
    <svg fill="currentcolor" height="22px" width="22px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 476.786 476.786" xmlSpace="preserve" stroke="currentcolor" strokeWidth="13.826793999999998"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M466.286,411.475H402.78V144.05l24.814-24.559l0.001,38.177c0,5.799,4.701,10.5,10.5,10.5c5.799,0,10.5-4.701,10.5-10.5 l-0.001-64.611c0-5.799-4.701-10.5-10.5-10.5h-64.608c-5.799,0-10.5,4.701-10.5,10.5c0,5.799,4.701,10.5,10.5,10.5h40.356 l-156.589,154.98l-74.255-74.79c-1.971-1.986-4.653-3.103-7.451-3.103c-0.001,0-0.002,0-0.003,0 c-2.799,0.001-5.481,1.119-7.452,3.107L26.539,326.479c-4.083,4.117-4.056,10.766,0.061,14.849c2.048,2.031,4.721,3.045,7.394,3.045 c2.701,0,5.402-1.036,7.455-3.106l12.587-12.692v82.901H21V54.812c0-5.799-4.701-10.5-10.5-10.5c-5.799,0-10.5,4.701-10.5,10.5 v367.163c0,5.799,4.701,10.5,10.5,10.5h455.786c5.799,0,10.5-4.701,10.5-10.5S472.085,411.475,466.286,411.475z M381.78,411.475 H267.689V277.754L381.78,164.835V411.475z M186.046,216.622l60.642,61.078v133.774h-60.642V216.622z M75.036,307.399l90.01-90.758 v194.833h-90.01V307.399z"></path> </g></svg>
);

export const AlertIcon = ({ size, currentColor}) => (
<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={currentColor} viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
    </svg>

);