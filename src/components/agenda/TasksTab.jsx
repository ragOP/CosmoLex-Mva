import React, { useState } from 'react';
import { Stack, IconButton, Typography, Box } from '@mui/material';
import { Search, RotateCcw, Grid3X3, List, CheckSquare, User, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAgenda } from '@/api/api_services/agenda';
import { Input } from '@/components/ui/input';

const TasksTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch agenda data
  const { data: agendaResponse, isLoading, refetch } = useQuery({
    queryKey: ['agenda'],
    queryFn: getAgenda,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const tasks = Array.isArray(agendaResponse?.tasks) ? agendaResponse.tasks : [];

  const handleRefresh = () => {
    refetch();
  };

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => 
    task.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="p-4">
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </Stack>
        </Stack>
        
        {/* Tasks List */}
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Loading tasks...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we fetch your tasks data
              </Typography>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="w-12 h-12 text-blue-500" />
              </div>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                No tasks yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                {searchTerm ? 
                  `No tasks found matching "${searchTerm}". Try adjusting your search terms.` :
                  "No tasks have been created yet. Tasks will appear here once they are added."
                }
              </Typography>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.isArray(filteredTasks) && filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {task.subject}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Task ID: {task.id}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{task.contact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{task.created_at}</span>
                        </div>
                      </div>


                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="w-full space-y-4">
                  {Array.isArray(filteredTasks) && filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl border border-gray-200 px-4 py-4 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {task.subject}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Task ID: {task.id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>Created: {task.created_at}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{task.contact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Stack>
    </div>
  );
};

export default TasksTab; 