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
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white box-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const Chip = ({ label, className = '' }) => (
  <span
    className={`inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium ${className}`}
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
        <div className="p-6">
          <div className="text-center text-gray-500">Loading key dates...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6">
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </Card>
    );
  }

  if (!caseType) {
    return (
      <Card>
        <div className="p-6">
          <div className="text-red-600 text-center">No case type found</div>
        </div>
      </Card>
    );
  }

  const fields = CASE_TYPE_FIELDS[caseType] || [];

  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <Chip label={caseType} />
      </div>
      <div className="p-6">
        {fields.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {fields.map((fieldName) => renderField(fieldName))}
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors duration-200 ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed opacity-70'
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
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
          <div className="text-gray-500 text-center py-6">
            No key dates configured for this case type.
          </div>
        )}
      </div>
    </Card>
  );
};

export default KeyDates;
