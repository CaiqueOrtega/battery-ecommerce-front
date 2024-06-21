import { useState, useEffect} from "react";

function TruncateText({ text, maxLength }) {
    const [truncatedText, setTruncatedText] = useState(text);

    useEffect(() => {
        if (text.length > maxLength) {
            setTruncatedText(text.substring(0, maxLength) + '...');
        } else {
            setTruncatedText(text);
        }
    }, [text, maxLength]);

    return <span>{truncatedText}</span>;
}


export default TruncateText;