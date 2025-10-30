import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import storeCaseKeyDates from '@/pages/matter/intake/helpers/storeCaseKeyDates';
import getCaseKeyDates from '@/pages/matter/intake/helpers/getCaseKeyDates';
import updateCaseKeyDates from '@/pages/matter/intake/helpers/updateCaseKeyDates';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import BreadCrumb from '@/components/BreadCrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMatter } from './MatterContext';
import isArrayWithValues from '@/utils/isArrayWithValues';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

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

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white/30 backdrop-blur-sm m-6 p-4 rounded-2xl border-none shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const KeyDates = () => {
  const navigate = useNavigate();
  const [caseType, setCaseType] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');

  const { matter, matterMeta } = useMatter();

  // Permission checks
  const { hasPermission } = usePermission();
  const canViewKeyDates = hasPermission('case-key-dates.view');
  const canGetKeyDates = hasPermission('case-key-dates.get');
  const canStoreKeyDates = hasPermission('case-key-dates.store');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (matter) {
          const caseType = matterMeta?.case_type?.find(
            (type) => type.id === matter.case_type_id
          )?.name;
          setCaseType(caseType);

          // Only fetch key dates if user has get permission
          if (canGetKeyDates) {
            const keyDatesResponse = await getCaseKeyDates(slugId);
            console.log('Key Dates Response:', keyDatesResponse);

            const initialData = {};
            if (CASE_TYPE_FIELDS[caseType]) {
              CASE_TYPE_FIELDS[caseType].forEach((field) => {
                if (keyDatesResponse && keyDatesResponse[field]) {
                  initialData[field] = keyDatesResponse[field];
                  setHasExistingData(true);
                } else {
                  initialData[field] = null;
                }
              });
            }
            setFormData(initialData);
          } else {
            // Initialize with empty data if no get permission
            const initialData = {};
            if (CASE_TYPE_FIELDS[caseType]) {
              CASE_TYPE_FIELDS[caseType].forEach((field) => {
                initialData[field] = null;
              });
            }
            setFormData(initialData);
          }
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
  }, [matter, matterMeta, canGetKeyDates]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const defaultFields = [
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
    ];

    const fields = CASE_TYPE_FIELDS[caseType] || defaultFields;
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
      <div className="flex gap-2 w-full items-center justify-between">
        <Label className="text-nowrap w-[40%] font-medium">
          {getFieldLabel(fieldName)}:
        </Label>
        <Input
          type="date"
          className="w-[60%]"
          key={fieldName}
          value={formData[fieldName]}
          placeholder="Select Date"
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          disabled={!canStoreKeyDates}
          // className="h-full"
        />
      </div>
    );
  };

  if (!caseType) {
    return (
      <Card>
        <div className="p-6">
          <div className="text-red-600 text-center">No case type found</div>
        </div>
      </Card>
    );
  }

  const defaultFields = [
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
  ];

  const fields = CASE_TYPE_FIELDS[caseType] || defaultFields;

  return (
    <PermissionGuard
      permission="case-key-dates.view"
      fallback={
        <Card>
          <div className="p-6">
            <div className="text-red-600 text-center">
              You don't have permission to view key dates.
            </div>
          </div>
        </Card>
      }
    >
      <Card>
        <BreadCrumb label={caseType} />
        <div className="bg-white/40 rounded-2xl p-6 flex flex-col justify-between gap-4 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full w-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : isArrayWithValues(fields) && fields.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((fieldName) => (
                  <div key={fieldName}>{renderField(fieldName)}</div>
                ))}
              </div>
              <div className="pt-4 flex justify-end gap-4">
                <PermissionGuard permission="case-key-dates.store">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </PermissionGuard>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-6">
              No key dates configured for this case type.
            </div>
          )}
        </div>
      </Card>
    </PermissionGuard>
  );
};

export default KeyDates;
