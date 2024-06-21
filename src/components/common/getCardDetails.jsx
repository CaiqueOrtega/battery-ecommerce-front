import {VisaIcon, MasterCardIcon, AmericanExpressIcon, EloIcon, DiscoverIcon, JcbIcon, DinersClubIcon, HipercardIcon, AuraCardIcon} from '../../assets/icons/IconsSet'

function getCardDetails(cardValue, smallSize) {
    console.log('teste no carddetails', cardValue)
    let cardDetails = {
        length: 16,
        primaryColor: '#888888',
        secondaryColor: '#818181',
        icon: null,
    };

    if (cardValue.match(/^3[47][0-9]{13}$/) || cardValue === 'American Express') {
        cardDetails = {
            length: 15,
            primaryColor: '#4B9CD3',
            secondaryColor: '#71C5E8',
            icon: <AmericanExpressIcon size={smallSize ? 22 : null} />,
        };
    } else if (cardValue.match(/^4[0-9]{12}(?:[0-9]{3})?$/) || cardValue === 'Visa') {
        cardDetails = {
            length: 16,
            primaryColor: '#1A1F71',
            secondaryColor: '#4F5BA6',
            icon: <VisaIcon size={smallSize ? 35 : null} />,
        };
    } else if (cardValue.match(/^5[1-5][0-9]{14}$/) || cardValue === 'MasterCard') {
        cardDetails = {
            length: 16,
            primaryColor: '#EB001B',
            secondaryColor: '#ff9413',
            icon: <MasterCardIcon size={smallSize ? 35 : null} />,
        };
    } else if (cardValue.match(/^6(?:011|5[0-9]{2})[0-9]{12}$/) || cardValue === 'Discover') {
        cardDetails = {
            length: 16,
            primaryColor: '#86B8CF',
            secondaryColor: '#B0D1E3',
            icon: <DiscoverIcon size={smallSize ? 35 : null} />,
        };
    } else if (cardValue.match(/^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/) || cardValue === 'Elo') {
        cardDetails = {
            length: 16,
            primaryColor: '#00A4E0',
            secondaryColor: '#66C7F4',
            icon: <EloIcon size={smallSize ? 35 : null} />,
        };
    } else if (cardValue.match(/^3(?:0[0-5]|[68]).*/) || cardValue === 'Diners Club') {
        cardDetails = {
            length: 14,
            primaryColor: '#0079BE',
            secondaryColor: '#4DA8DA',
            icon: <DinersClubIcon size={smallSize ? 35 : null} />,
        };
    } else if (cardValue.match(/^606282|^3841(?:[0|4|6]{1})0/) || cardValue === 'HiperCard') {
        cardDetails = {
            length: 16,
            primaryColor: '#B20838',
            secondaryColor: '#E73561',
            icon: <HipercardIcon size={smallSize ? 35 : null} />,
        };
    } else if (cardValue.match(/^(?:2131|1800|35\d{3})\d{11}/) || cardValue === 'JCB') {
        cardDetails = {
            length: 16,
            primaryColor: '#1F5CA7',
            secondaryColor: '#497EC7',
            icon: <JcbIcon size={smallSize ? 35 : null} />,
        };
    } else if (cardValue.match(/^((?!504175))^((?!5067))(^50[0-9])/) || cardValue === 'Aura') {
        cardDetails = {
            length: 16,
            primaryColor: '#ffff00',
            secondaryColor: '#fec117',
            icon: <AuraCardIcon size={smallSize ? 35 : null} />,
        };
    }

    return cardDetails;
}

export default getCardDetails;