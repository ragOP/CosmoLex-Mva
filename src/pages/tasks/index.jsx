import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/Button';
import { Button as UIButton } from '@/components/ui/button';
import TaskDialog from '@/components/dialogs/TaskDialog';
import ShowTaskDialog from '@/components/tasks/ShowTaskDialog';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import TaskTable from '@/components/tasks/TaskTable';
import { Loader2, Plus, Filter as FilterIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import { useMatter } from '@/components/inbox/MatterContext';
import getMetaOptions from '@/utils/getMetaFields';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
// no client-side date parsing; filtering is done server-side
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const TasksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  // Comment dialog removed

  // Get user data from Redux store
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role_id === 1;

  // Get matter slug from URL params (assuming notes are matter-specific)
  const matterSlug = searchParams.get('slugId');

  // Only call useMatter if slugId exists to prevent unnecessary API calls
  const matter = matterSlug ? useMatter() : null;
  const {
    tasks,
    tasksMeta,
    tasksLoading,
    updateStatus,
    deleteTask,
    isDeleting,
    filterTasks,
  } = useTasks();

  // Multi-filter params from URL
  const clientNameParam = searchParams.get('client_name') || '';
  const priorityIdParam = searchParams.get('priority_id') || '';
  const statusIdParam = searchParams.get('status_id') || '';
  const assignedToParam = searchParams.get('assigned_to') || '';
  const fromDateParam = searchParams.get('from_date') || '';
  const toDateParam = searchParams.get('to_date') || '';
  const assignedByParam = searchParams.get('assigned_by') || '';
  const administratorParam = searchParams.get('administrator') || '';

  // Build select options
  const priorityOptions = useMemo(
    () => getMetaOptions({ metaField: 'taks_priority', metaObj: tasksMeta }),
    [tasksMeta]
  );
  const statusOptions = useMemo(
    () => getMetaOptions({ metaField: 'taks_status', metaObj: tasksMeta }),
    [tasksMeta]
  );
  const clientOptions = useMemo(() => {
    const list = Array.isArray(tasks) ? tasks : [];
    const setNames = new Set();
    for (const t of list) {
      const name = (t?.contact_name || '').trim();
      if (name) setNames.add(name);
    }
    return Array.from(setNames).sort();
  }, [tasks]);
  const assigneeOptions = useMemo(() => {
    const list = Array.isArray(tasks) ? tasks : [];
    const map = new Map();

    for (const t of list) {
      const arr = Array.isArray(t?.assignees) ? t.assignees : [];
      for (const a of arr) {
        // Handle assignees with or without ID
        const assigneeId = a?.id || a?.user_id || a?.assignee_id;
        const assigneeName = a?.name || a?.user_name || a?.assignee_name;

        // Use ID if available, otherwise use name as the key
        const key = assigneeId || assigneeName;

        if (assigneeName && key && !map.has(key)) {
          map.set(key, assigneeName);
        }
      }
    }

    return Array.from(map.entries())
      .map(([key, name]) => ({ id: key, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  const assignedByOptions = useMemo(() => {
    const list = Array.isArray(tasks) ? tasks : [];
    const map = new Map();

    for (const task of list) {
      const assignedBy = task?.assigned_by;
      if (assignedBy?.name) {
        const key = assignedBy.id || assignedBy.name;
        if (!map.has(key)) {
          map.set(key, assignedBy.name);
        }
      }
    }

    return Array.from(map.entries())
      .map(([key, name]) => ({ id: key, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  const administratorOptions = useMemo(() => {
    return [
      { id: 'all', name: 'All' },
      { id: 'me', name: 'Me' },
    ];
  }, []);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== '') next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('client_name');
    next.delete('priority_id');
    next.delete('status_id');
    next.delete('assigned_to');
    next.delete('assigned_by');
    next.delete('from_date');
    next.delete('to_date');
    next.delete('administrator');
    setSearchParams(next, { replace: true });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (clientNameParam) count += 1;
    if (priorityIdParam) count += 1;
    if (statusIdParam) count += 1;
    if (assignedToParam) count += 1;
    if (fromDateParam) count += 1;
    if (toDateParam) count += 1;
    if (assignedByParam) count += 1;
    if (administratorParam) count += 1;
    return count;
  }, [
    clientNameParam,
    priorityIdParam,
    statusIdParam,
    assignedToParam,
    fromDateParam,
    toDateParam,
    assignedByParam,
    administratorParam,
  ]);

  // Server-side filtered tasks
  const [serverTasks, setServerTasks] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const hasFilters =
      !!clientNameParam ||
      !!priorityIdParam ||
      !!statusIdParam ||
      !!assignedToParam ||
      !!fromDateParam ||
      !!toDateParam ||
      !!assignedByParam ||
      !!administratorParam;

    if (!hasFilters) {
      setServerTasks(Array.isArray(tasks) ? tasks : []);
      return;
    }

    // For assignee or assigned by filtering, try client-side first since we're using names as keys
    if (
      (assignedToParam || assignedByParam) &&
      !clientNameParam &&
      !priorityIdParam &&
      !statusIdParam &&
      !fromDateParam &&
      !toDateParam &&
      !administratorParam
    ) {
      // Client-side filtering for assignee and/or assigned by
      const filteredTasks = (Array.isArray(tasks) ? tasks : []).filter(
        (task) => {
          let matchesAssignee = true;
          let matchesAssignedBy = true;

          // Check assignee filter
          if (assignedToParam) {
            const assignees = Array.isArray(task?.assignees)
              ? task.assignees
              : [];
            matchesAssignee = assignees.some((assignee) => {
              const assigneeName =
                assignee?.name ||
                assignee?.user_name ||
                assignee?.assignee_name;
              return assigneeName === assignedToParam;
            });
          }

          // Check assigned by filter
          if (assignedByParam) {
            const assignedBy = task?.assigned_by;
            const assignedByName = assignedBy?.name;
            matchesAssignedBy = assignedByName === assignedByParam;
          }

          return matchesAssignee && matchesAssignedBy;
        }
      );
      setServerTasks(filteredTasks);
      return;
    }

    const qs = new URLSearchParams();
    if (clientNameParam) qs.set('client_name', clientNameParam);
    if (priorityIdParam) qs.set('priority_id', priorityIdParam);
    if (statusIdParam) qs.set('status_id', statusIdParam);
    if (assignedToParam) qs.set('assigned_to', assignedToParam);
    if (fromDateParam) qs.set('from_date', fromDateParam);
    if (toDateParam) qs.set('to_date', toDateParam);
    if (assignedByParam) qs.set('assigned_by', assignedByParam);
    if (administratorParam) qs.set('administrator', administratorParam);
    setIsFiltering(true);
    filterTasks(qs.toString())
      .then((data) => {
        setServerTasks(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setServerTasks([]);
      })
      .finally(() => setIsFiltering(false));
  }, [
    tasks,
    clientNameParam,
    priorityIdParam,
    statusIdParam,
    assignedToParam,
    fromDateParam,
    toDateParam,
    assignedByParam,
    administratorParam,
    filterTasks,
  ]);

  // Handlers
  const handleDelete = (id) => {
    deleteTask(id).then(() => setShowDeleteConfirm(false));
  };

  const handleUpdateTaskStatus = (id, status) =>
    updateStatus({ taskId: id, status_id: parseInt(status) });

  const handleCommentClick = (task) => {
    // Navigate to comments page with taskId (and slugId if present)
    if (matterSlug) {
      navigate(
        `/dashboard/inbox/tasks/comments?slugId=${matterSlug}&taskId=${task.id}`,
        { replace: false }
      );
    } else {
      navigate(`/dashboard/tasks/comments?taskId=${task.id}`, {
        replace: false,
      });
    }
  };

  const handleNavigate = (taskId) => {
    if (matterSlug) {
      if (taskId) {
        navigate(
          `/dashboard/inbox/tasks?slugId=${matterSlug}&taskId=${taskId}`,
          {
            replace: false,
          }
        );
      } else {
        navigate(`/dashboard/inbox/tasks?slugId=${matterSlug}`, {
          replace: false,
        });
      }
    } else {
      if (taskId) {
        navigate(`/dashboard/tasks?taskId=${taskId}`, {
          replace: false,
        });
      } else {
        navigate(`/dashboard/tasks`, {
          replace: false,
        });
      }
    }
  };

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">
      <div className="flex justify-between w-full items-center px-4 pt-4">
        <p className="text-2xl font-bold">
          Tasks ({(serverTasks || tasks || []).length})
        </p>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <UIButton
                variant="outline"
                className={`h-10 px-4 flex items-center gap-2 transition-all duration-200 ${
                  activeFiltersCount > 0
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'hover:bg-gray-50'
                }`}
              >
                <FilterIcon className="h-4 w-4" />
                {activeFiltersCount
                  ? `Filters (${activeFiltersCount})`
                  : 'Filter'}
                {activeFiltersCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-500 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </UIButton>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full mx-4">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Filter Tasks
                </DialogTitle>
                {activeFiltersCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {activeFiltersCount} filter
                    {activeFiltersCount > 1 ? 's' : ''} applied
                  </p>
                )}
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Client
                    </label>
                    <Select
                      value={
                        clientNameParam === '' ? '__all__' : clientNameParam
                      }
                      onValueChange={(val) =>
                        updateParam('client_name', val === '__all__' ? '' : val)
                      }
                      disabled={tasksLoading}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="All clients" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-auto">
                        <SelectItem value="__all__">All clients</SelectItem>
                        {clientOptions.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Priority
                    </label>
                    <Select
                      value={
                        priorityIdParam === '' ? '__all__' : priorityIdParam
                      }
                      onValueChange={(val) =>
                        updateParam('priority_id', val === '__all__' ? '' : val)
                      }
                      disabled={tasksLoading}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="All priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All priorities</SelectItem>
                        {priorityOptions.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Status
                    </label>
                    <Select
                      value={statusIdParam === '' ? '__all__' : statusIdParam}
                      onValueChange={(val) =>
                        updateParam('status_id', val === '__all__' ? '' : val)
                      }
                      disabled={tasksLoading}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All statuses</SelectItem>
                        {statusOptions.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Assignee
                    </label>
                    <Select
                      value={
                        assignedToParam === '' ? '__all__' : assignedToParam
                      }
                      onValueChange={(val) =>
                        updateParam('assigned_to', val === '__all__' ? '' : val)
                      }
                      disabled={tasksLoading}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="All assignees" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-auto">
                        <SelectItem value="__all__">All assignees</SelectItem>
                        {assigneeOptions.map((a) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Assigned By
                    </label>
                    <Select
                      value={
                        assignedByParam === '' ? '__all__' : assignedByParam
                      }
                      onValueChange={(val) =>
                        updateParam('assigned_by', val === '__all__' ? '' : val)
                      }
                      disabled={tasksLoading}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="All assigned by" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-auto">
                        <SelectItem value="__all__">All assigned by</SelectItem>
                        {assignedByOptions.map((a) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      From Date
                    </label>
                    <Input
                      type="date"
                      value={fromDateParam}
                      onChange={(e) => updateParam('from_date', e.target.value)}
                      className="h-10 w-full"
                      placeholder="Select from date"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      To Date
                    </label>
                    <Input
                      type="date"
                      value={toDateParam}
                      onChange={(e) => updateParam('to_date', e.target.value)}
                      className="h-10 w-full"
                      placeholder="Select to date"
                    />
                  </div>

                  {isAdmin && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Administrator
                      </label>
                      <Select
                        value={
                          administratorParam === ''
                            ? '__all__'
                            : administratorParam
                        }
                        onValueChange={(val) =>
                          updateParam(
                            'administrator',
                            val === '__all__' ? '' : val
                          )
                        }
                        disabled={tasksLoading}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">All</SelectItem>
                          {administratorOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={clearAllFilters}
                  disabled={activeFiltersCount === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeFiltersCount === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  Clear all filters
                </button>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center gap-2 shadow-lg"
                    style={{
                      background:
                        'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Apply filters
                  </button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 shadow-lg cursor-pointer"
            style={{
              background:
                'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      <TaskTable
        tasks={serverTasks || tasks || []}
        tasksMeta={tasksMeta || []}
        handleUpdateTaskStatus={handleUpdateTaskStatus}
        onRowClick={(params) => {
          // append taskId to url params
          handleNavigate(params.row.id);
          setSelectedTaskId(params.row.id);
          setSelectedTask(params.row);
          setShowViewDialog(true);
        }}
        handleEdit={(task) => {
          handleNavigate(task.id);
          setSelectedTaskId(task.id);
          setSelectedTask(task);
          setShowUpdateDialog(true);
        }}
        handleDelete={(task) => {
          setSelectedTask(task);
          setShowDeleteConfirm(true);
        }}
        handleCommentClick={handleCommentClick}
      />

      {/* View */}
      {showViewDialog && (
        <ShowTaskDialog
          open={showViewDialog}
          onClose={() => {
            // remove taskId from url params
            handleNavigate(null);
            setShowViewDialog(false);
          }}
        />
      )}

      {open && (
        <TaskDialog open={open} onClose={() => setOpen(false)} mode="create" />
      )}

      {showUpdateDialog && (
        <TaskDialog
          open={showUpdateDialog}
          onClose={() => {
            setShowUpdateDialog(false);
            handleNavigate(null);
          }}
          task={selectedTask}
          mode="update"
        />
      )}

      {/* Delete */}
      {showDeleteConfirm && (
        <DeleteTaskDialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          task={selectedTask}
          onConfirm={() => handleDelete(selectedTask?.id)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default TasksPage;
