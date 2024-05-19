import { useState } from 'react';
import './App.css'
import Form from './components/Form'
import PdfViewer from './components/PdfViewer';

function App() {
  const [savedData, setSavedData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    experience: []
  });

  const handleFormSubmit = (data: typeof savedData) => {
    setSavedData(data);
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/2 p-4">
        <Form onSubmit={handleFormSubmit} savedData={savedData} />
      </div>
      <div className="w-1/2 p-4">
        <PdfViewer data={savedData} />
      </div>
    </div>
  );
}

export default App
