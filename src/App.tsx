import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const App: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [infoText, setInfoText] = useState<string>('Loading');

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/document/'); // URL de la API
                const data = await response.json();
                setContent(data.content);
                setInfoText('');
            } catch (error) {
                setInfoText('Data loading error: ' + error);
            } finally {
                setLoading(false);
            }
        };

        fetchText();
    }, []);


    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/document/save/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }), // Envía el contenido como un JSON
            });

            if (!response.ok) {
                throw new Error('Error on request');
            }

            const result = await response.json();
            alert(result.message)
            setInfoText(result.message);

        } catch (error) {
            console.error('Error:', error);
            setInfoText('Error saving data: ' + error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ margin: '5px' }}>
                <h1>Simple Text Editor</h1>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        width: '100%',
                        height: '200px',
                        border: '1px solid #ccc',
                        padding: '10px',
                        background: '#f9f9f9',
                        fontFamily: 'monospace',
                        resize: 'none',
                    }}
                />
            </div>

            <h1>Rich Text Editor</h1>
            <ReactQuill value={content} onChange={setContent} />

            <button onClick={handleSave} style={{ marginTop: '20px' }}>
                Save
            </button>

            {infoText && <p>{infoText}</p>} {/* Muestra el mensaje al usuario */}
        </div>
    );
};

export default App;
