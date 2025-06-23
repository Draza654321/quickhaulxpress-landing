import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    mc_number: '',
    equipment_type: '',
    zip_code: '',
    location: '',
    current_rate: '',
    urgency: '',
    comments: '',
    w9: null,
    coi: null,
    mc_authority: null,
    factoring_doc: null,
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('https://api.quickhaulxpressllc.dpdns.org/api/contact/submit', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Thank you! Your form has been submitted successfully.');
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          mc_number: '',
          equipment_type: '',
          zip_code: '',
          location: '',
          current_rate: '',
          urgency: '',
          comments: '',
          w9: null,
          coi: null,
          mc_authority: null,
          factoring_doc: null,
        });
        // Clear file input fields visually
        document.getElementById('w9').value = '';
        document.getElementById('coi').value = '';
        document.getElementById('mc_authority').value = '';
        document.getElementById('factoring_doc').value = '';
      } else {
        const errorData = await response.json();
        setMessage(`Error submitting form: ${errorData.error || response.statusText}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(`Error submitting form: ${error.message}`);
      setIsError(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>QuickHaulXpress Contact Form</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name:</label>
            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="mc_number">MC Number:</label>
            <input type="text" id="mc_number" name="mc_number" value={formData.mc_number} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="equipment_type">Equipment Type:</label>
            <input type="text" id="equipment_type" name="equipment_type" value={formData.equipment_type} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="zip_code">Zip Code:</label>
            <input type="text" id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="current_rate">Current Rate:</label>
            <input type="text" id="current_rate" name="current_rate" value={formData.current_rate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="urgency">Urgency:</label>
            <select id="urgency" name="urgency" value={formData.urgency} onChange={handleChange}>
              <option value="">Select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="comments">Comments:</label>
            <textarea id="comments" name="comments" value={formData.comments} onChange={handleChange}></textarea>
          </div>

          <div className="form-group file-upload">
            <label htmlFor="w9">W-9 Document:</label>
            <input type="file" id="w9" name="w9" onChange={handleFileChange} />
          </div>
          <div className="form-group file-upload">
            <label htmlFor="coi">COI Document:</label>
            <input type="file" id="coi" name="coi" onChange={handleFileChange} />
          </div>
          <div className="form-group file-upload">
            <label htmlFor="mc_authority">MC Authority Document:</label>
            <input type="file" id="mc_authority" name="mc_authority" onChange={handleFileChange} />
          </div>
          <div className="form-group file-upload">
            <label htmlFor="factoring_doc">Factoring Document:</label>
            <input type="file" id="factoring_doc" name="factoring_doc" onChange={handleFileChange} />
          </div>

          <button type="submit">Submit</button>
        </form>
        {message && (
          <p className={isError ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
}

export default App;


