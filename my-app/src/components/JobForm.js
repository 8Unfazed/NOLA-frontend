import React, { useState, useEffect } from 'react';
import '../styles/JobForm.css';

const JobForm = ({ initialData = null, onSubmit, isLoading = false, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    description: '',
    contract_type: 'full-time',
    hours_per_week: 40,
    location_type: 'remote',
    location_details: '',
    roles_and_responsibilities: [],
    requirements: [],
    desired_skills: [],
    experience_required: '',
    status: 'open'
  });

  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        roles_and_responsibilities: initialData.roles_and_responsibilities || [],
        requirements: initialData.requirements || [],
        desired_skills: initialData.desired_skills || []
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours_per_week' ? parseInt(value) || 0 : value
    }));
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        roles_and_responsibilities: [...prev.roles_and_responsibilities, responsibilityInput]
      }));
      setResponsibilityInput('');
    }
  };

  const removeResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      roles_and_responsibilities: prev.roles_and_responsibilities.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        desired_skills: [...prev.desired_skills, skillInput]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      desired_skills: prev.desired_skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.title.trim()) {
      alert('Job title is required');
      return;
    }
    
    if (!formData.position || !formData.position.trim()) {
      alert('Position is required');
      return;
    }
    
    if (!formData.contract_type) {
      alert('Contract type is required');
      return;
    }
    
    if (!formData.location_type) {
      alert('Location type is required');
      return;
    }
    
    // Create a copy without read-only fields
    const submitData = { ...formData };
    
    // Remove fields that shouldn't be updated
    delete submitData.id;
    delete submitData.client_id;
    delete submitData.posted_at;
    delete submitData.updated_at;
    delete submitData.assigned_developer;
    delete submitData.client;
    delete submitData.comments;
    
    console.log('Submitting job data:', submitData);
    onSubmit(submitData);
  };

  return (
    <div className="job-form-container">
      <form className="job-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Full Stack Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="e.g., Full Stack Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of the job..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Contract Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Contract Type *</label>
              <select
                name="contract_type"
                value={formData.contract_type}
                onChange={handleInputChange}
                required
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hours Per Week</label>
              <input
                type="number"
                name="hours_per_week"
                value={formData.hours_per_week}
                onChange={handleInputChange}
                placeholder="e.g., 40"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Location</h3>
          
          <div className="form-group">
            <label>Location Type *</label>
            <select
              name="location_type"
              value={formData.location_type}
              onChange={handleInputChange}
              required
            >
              <option value="remote">Remote</option>
              <option value="physical">Physical Location</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              {formData.location_type === 'remote' 
                ? 'Technical Requirements' 
                : formData.location_type === 'physical'
                ? 'Location Address'
                : 'Location Details'}
            </label>
            <textarea
              name="location_details"
              value={formData.location_details}
              onChange={handleInputChange}
              placeholder={
                formData.location_type === 'remote'
                  ? 'e.g., Proficiency in working with distributed teams, timezone flexibility'
                  : formData.location_type === 'physical'
                  ? 'e.g., 123 Main St, New York, NY 10001'
                  : 'e.g., Part of the time in office, flexible remote options'
              }
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Roles & Responsibilities</h3>
          
          <div className="list-input-group">
            <div className="input-with-button">
              <input
                type="text"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                placeholder="Add a responsibility..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addResponsibility();
                  }
                }}
              />
              <button
                type="button"
                onClick={addResponsibility}
                className="add-btn"
              >
                Add
              </button>
            </div>

            <ul className="list-display">
              {formData.roles_and_responsibilities.map((responsibility, index) => (
                <li key={index} className="list-item">
                  <span>{responsibility}</span>
                  <button
                    type="button"
                    onClick={() => removeResponsibility(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="form-section">
          <h3>Requirements</h3>
          
          <div className="list-input-group">
            <div className="input-with-button">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="add-btn"
              >
                Add
              </button>
            </div>

            <ul className="list-display">
              {formData.requirements.map((requirement, index) => (
                <li key={index} className="list-item">
                  <span>{requirement}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="form-section">
          <h3>Desired Skills</h3>
          
          <div className="list-input-group">
            <div className="input-with-button">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="add-btn"
              >
                Add
              </button>
            </div>

            <ul className="list-display">
              {formData.desired_skills.map((skill, index) => (
                <li key={index} className="list-item">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="form-section">
          <h3>Experience</h3>
          
          <div className="form-group">
            <label>Experience Required</label>
            <textarea
              name="experience_required"
              value={formData.experience_required}
              onChange={handleInputChange}
              placeholder="e.g., Minimum 3 years of experience with React, Node.js, and database design..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Job' : 'Create Job')}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobForm;
