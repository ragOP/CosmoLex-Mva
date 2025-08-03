import { useEffect, useState } from 'react';
import getMatter from '@/pages/matter/intake/helpers/getMatter';
import storeCaseKeyDates from '@/pages/matter/intake/helpers/storeCaseKeyDates';
import getCaseKeyDates from '@/pages/matter/intake/helpers/getCaseKeyDates';
import updateCaseKeyDates from '@/pages/matter/intake/helpers/updateCaseKeyDates';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const CASE_TYPE_FIELDS = {
  'Auto Accident': [
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'complaint_filed',
    'date_of_incident',
    'discovery_due_date',
    'lawsuit_filed_date',
    'lead_created_date',
    'mediation',
    'sol_date',
    'trial_date',
  ],
  Bankruptcy: [
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'date_of_denial',
    'date_of_incident',
    'discovery_due_date',
    'lawsuit_filed_date',
    'lead_created_date',
    'petition_file_date',
    'sol_date',
    'trial_date',
  ],
  Custody: [
    'case_conference',
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'complaint_filed',
    'date_of_incident',
    'discovery_due_date',
    'lawsuit_filed_date',
    'lead_created_date',
    'sol_date',
    'trial_date',
  ],
  'Divorce With Children': [
    'case_conference',
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'complaint_filed',
    'date_of_incident',
    'discovery_due_date',
    'lawsuit_filed_date',
    'lead_created_date',
    'sol_date',
    'trial_date',
  ],
  'Divorce Without Children': [
    'case_conference',
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'complaint_filed',
    'date_of_incident',
    'discovery_due_date',
    'lawsuit_filed_date',
    'lead_created_date',
    'sol_date',
    'trial_date',
  ],
  'Dog Bite': [
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'complaint_filed',
    'date_of_incident',
    'discovery_due_date',
    'lawsuit_filed_date',
    'lead_created_date',
    'mediation',
    'sol_date',
    'trial_date',
  ],
  'Domestic Violence/Restraining Orders': [
    'case_conference',
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'complaint_filed',
    'date_of_incident',
    'discovery_due_date',
    'lawsuit_filed_date',
    'lead_created_date',
    'sol_date',
    'trial_date',
  ],
  'Employment Law': [
    'case_created_date',
    'case_opened_date',
    'claim_filed_date',
    'closed_date',
    'complaint_filed',
    'date_of_incident',
  ],
};

const getFieldLabel = (fieldName) => {
  const labelMap = {
    case_created_date: 'Case Created Date',
    case_opened_date: 'Case Opened Date',
    claim_filed_date: 'Claim Filed Date',
    closed_date: 'Closed Date',
    complaint_filed: 'Complaint Filed Date',
    date_of_incident: 'Date of Incident',
    discovery_due_date: 'Discovery Due Date',
    lawsuit_filed_date: 'Lawsuit Filed Date',
    lead_created_date: 'Lead Created Date',
    mediation: 'Mediation Date',
    sol_date: 'Statute of Limitations Date',
    trial_date: 'Trial Date',
    date_of_denial: 'Date of Denial',
    case_conference: 'Case Conference Date',
    petition_file_date: 'Petition File Date',
  };

  return (
    labelMap[fieldName] ||
    fieldName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

const DateInput = ({ label, value, onChange }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
        }}
      >
        {label}
      </label>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div
    style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

const Chip = ({ label, style = {} }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: '#1976d2',
      color: '#ffffff',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
      ...style,
    }}
  >
    {label}
  </span>
);

const KeyDates = () => {
  const [caseType, setCaseType] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const matterResponse = await getMatter({ slug: slugId });

        if (matterResponse) {
          setCaseType(matterResponse.case_type);
          const keyDatesResponse = await getCaseKeyDates(slugId);

          const initialData = {};
          if (CASE_TYPE_FIELDS[matterResponse.case_type]) {
            CASE_TYPE_FIELDS[matterResponse.case_type].forEach((field) => {
              if (keyDatesResponse && keyDatesResponse[field]) {
                initialData[field] = keyDatesResponse[field];
                setHasExistingData(true);
              } else {
                initialData[field] = matterResponse[field] || '';
              }
            });
          }
          setFormData(initialData);
        } else {
          setError('Failed to fetch matter data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    if (slugId) {
      fetchData();
    }
  }, [slugId]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const fields = CASE_TYPE_FIELDS[caseType] || [];
    const submitData = {};

    fields.forEach((fieldName) => {
      submitData[fieldName] =
        formData[fieldName] && formData[fieldName].trim() !== ''
          ? formData[fieldName]
          : null;
    });

    try {
      let result;
      if (hasExistingData) {
        result = await updateCaseKeyDates(slugId, submitData);
        if (result) {
          toast.success('Key dates updated successfully!');
        } else {
          toast.error('Failed to update key dates.');
        }
      } else {
        result = await storeCaseKeyDates(slugId, submitData);
        if (result) {
          toast.success('Key dates created successfully!');
          setHasExistingData(true);
        } else {
          toast.error('Failed to create key dates.');
        }
      }
    } catch (error) {
      console.error('Error storing key dates:', error);
      toast.error('Failed to save key dates.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (fieldName) => {
    return (
      <DateInput
        key={fieldName}
        label={getFieldLabel(fieldName)}
        value={formData[fieldName]}
        onChange={(value) => handleFieldChange(fieldName, value)}
      />
    );
  };

  if (loading) {
    return (
      <Card>
        <div style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            Loading key dates...
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ padding: '24px' }}>
          <div style={{ color: '#dc2626', textAlign: 'center' }}>{error}</div>
        </div>
      </Card>
    );
  }

  if (!caseType) {
    return (
      <Card>
        <div style={{ padding: '24px' }}>
          <div style={{ color: '#dc2626', textAlign: 'center' }}>
            No case type found
          </div>
        </div>
      </Card>
    );
  }

  const fields = CASE_TYPE_FIELDS[caseType] || [];

  return (
    <Card>
      <div
        style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Chip label={caseType} />
      </div>
      <div style={{ padding: '24px' }}>
        {fields.length > 0 ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              {fields.map((fieldName) => renderField(fieldName))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  backgroundColor: submitting ? '#9ca3af' : '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease',
                  opacity: submitting ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: submitting ? '#9ca3af' : '#1565c0',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                    cursor: 'not-allowed',
                  },
                }}
              >
                {submitting
                  ? 'Submitting...'
                  : hasExistingData
                  ? 'Update'
                  : 'Submit'}
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              color: '#6b7280',
              textAlign: 'center',
              padding: '24px',
            }}
          >
            No key dates configured for this case type.
          </div>
        )}
      </div>
    </Card>
  );
};

export default KeyDates;
