import React from 'react';
import '../styles/JobDetail.css';

const JobDetail = ({ job, onClose, onApply = null }) => {
  if (!job) {
    return null;
  }

  return (
    <div className="job-detail-overlay" onClick={onClose}>
      <div className="job-detail-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="job-detail-header">
          <h2>{job.title}</h2>
          {job.position && <p className="position">{job.position}</p>}
          {job.client && (
            <p className="client-name">Posted by: <strong>{job.client.business_name || 'Business'}</strong></p>
          )}
        </div>

        <div className="job-detail-content">
          {job.description && (
            <section className="detail-section">
              <h3>Description</h3>
              <p>{job.description}</p>
            </section>
          )}

          <div className="detail-grid">
            {job.contract_type && (
              <section className="detail-section small">
                <h4>Contract Type</h4>
                <p className="badge">{job.contract_type}</p>
              </section>
            )}

            {job.hours_per_week && (
              <section className="detail-section small">
                <h4>Commitment</h4>
                <p className="badge">{job.hours_per_week} hours/week</p>
              </section>
            )}

            {job.location_type && (
              <section className="detail-section small">
                <h4>Location Type</h4>
                <p className="badge">{job.location_type}</p>
              </section>
            )}

            {job.status && (
              <section className="detail-section small">
                <h4>Status</h4>
                <p className={`badge status-${job.status}`}>{job.status}</p>
              </section>
            )}
          </div>

          {job.location_details && (
            <section className="detail-section">
              <h3>Location Details</h3>
              <p>{job.location_details}</p>
            </section>
          )}

          {job.experience_required && (
            <section className="detail-section">
              <h3>Experience Required</h3>
              <p>{job.experience_required}</p>
            </section>
          )}

          {job.roles_and_responsibilities && job.roles_and_responsibilities.length > 0 && (
            <section className="detail-section">
              <h3>Roles & Responsibilities</h3>
              <ul className="detail-list">
                {job.roles_and_responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <section className="detail-section">
              <h3>Requirements</h3>
              <ul className="detail-list">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {job.desired_skills && job.desired_skills.length > 0 && (
            <section className="detail-section">
              <h3>Desired Skills</h3>
              <div className="skills-list">
                {job.desired_skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {job.posted_at && (
            <section className="detail-section meta">
              <p>Posted: {new Date(job.posted_at).toLocaleDateString()}</p>
            </section>
          )}
        </div>

        {onApply && (
          <div className="job-detail-footer">
            <button className="apply-job-btn" onClick={onApply}>
              Apply for this Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
