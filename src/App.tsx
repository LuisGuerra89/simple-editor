import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const App: React.FC = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
    const [content, setContent] = useState<string>('');
    const [infoText, setInfoText] = useState<string>('Loading');
    const [useRichText, setUseRichText] = useState<boolean>(true);
    const [fetchUrl, setFetchUrl] = useState<string>('http://localhost:8000/api/document/');
    const [saveUrl, setSaveUrl] = useState<string>('http://localhost:8000/api/document/save/');
    const [listUrl, setListUrl] = useState<string>('http://localhost:8000/api/document/list/');

    useEffect(() => {
        fetchDocuments();
    }, [listUrl]);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(listUrl);
            const data = await response.json();
            setDocuments(data);
            setInfoText('');
        } catch (error) {
            setInfoText('Error loading documents: ' + error);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(saveUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, id: selectedDocument }),
            });

            if (!response.ok) {
                throw new Error('Error on request');
            }

            const result = await response.json();
            setInfoText(result.message);

            if (selectedDocument) {
                setDocuments((prevDocuments) =>
                    prevDocuments.map((doc) =>
                        doc.id === selectedDocument ? { ...doc, content } : doc
                    )
                );
            } else {
                const newDocument = { id: result.id, content };
                setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
            }

            alert(result.message);
        } catch (error) {
            console.error('Error:', error);
            setInfoText('Error saving data: ' + error);
        }
    };

    const handleSelectDocument = async (id: number) => {
        try {
            const response = await fetch(`${fetchUrl}${id}/`);
            const data = await response.json();
            setSelectedDocument(id);
            setContent(data.content);
        } catch (error) {
            console.error('Error loading document:', error);
        }
    };

    const handleNewDocument = () => {
        setSelectedDocument(null);
        setContent('');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Simple Editor</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>URLs Configuration</h3>
                <label>
                    Fetch Document URL:
                    <input
                        readOnly
                        type="text"
                        value={fetchUrl}
                        onChange={(e) => setFetchUrl(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </label>
                <label>
                    Save Document URL:
                    <input
                        readOnly
                        type="text"
                        value={saveUrl}
                        onChange={(e) => setSaveUrl(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </label>
                <label>
                    List Documents URL:
                    <input
                        readOnly
                        type="text"
                        value={listUrl}
                        onChange={(e) => setListUrl(e.target.value)}
                        style={{ width: '100%', marginBottom: '20px' }}
                    />
                </label>
            </div>

            <div>
                <h3>History</h3>
                <ul>
                    {documents.map((doc) => (
                        <li key={doc.id}>
                            {doc.content.substring(0, 30)}...
                            <button onClick={() => handleSelectDocument(doc.id)}>Edit</button>
                        </li>
                    ))}
                </ul>
                <button onClick={handleNewDocument}>New Document</button>
            </div>

            <div style={{ margin: '20px 0' }}>
                <h3>{selectedDocument ? `Editing Document #${selectedDocument}` : 'New Document'}</h3>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={useRichText}
                            onChange={() => setUseRichText(!useRichText)}
                        />
                        Use Rich Text Editor
                    </label>
                </div>

                {useRichText ? (
                    <>
                        <h4>Rich Text Editor</h4>
                        <ReactQuill value={content} onChange={setContent} />
                    </>
                ) : (
                    <div style={{margin:'5px'}}>
                        <h4>Plain Text Editor</h4>
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
                                marginBottom: '20px',
                            }}
                        />
                    </div>
                )}

                <button onClick={handleSave} style={{ marginTop: '20px' }}>
                    {selectedDocument ? 'Save Changes' : 'Save New Document'}
                </button>
            </div>

            {infoText && <p>{infoText}</p>}
        </div>
    );
};

export default App;
