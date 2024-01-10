import { useState, useEffect } from "react";

interface Name {
    id: string;
    name: string;
}

function Names() {
    const [names, setNames] = useState<Name[]>([]);

    useEffect(() => {
        async function getNames() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/names/`);
            const names = await response.json();
            setNames(names);
        }

        getNames();
    }, []);

    return (
        <ul>
            {names.map(n => <li key={n.id}>{n.name}</li>)}
        </ul>
    );
}

export default Names;