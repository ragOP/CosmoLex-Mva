import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import BreadCrumb from '@/components/BreadCrumb';
import CreateEditNoteDialog from '@/components/notes/CreateEditNoteDialog';
import {
    Plus,
    List,
    Grid3X3,
    Search,
    Edit,
    Trash2,
    Eye,
    Paperclip,
    Tag
} from 'lucide-react';
import { getNotes, createNote, updateNote, deleteNote, getNotesMeta } from '@/api/api_services/notes';
import { toast } from 'sonner';

const NotesPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Categories will be fetched from API
    const [categories, setCategories] = useState([
    ]);

    console.log("categoriesData", categories)


    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    // Function to clear all states
    const clearStates = () => {
        setDialogOpen(false);
        setEditingNote(null);
        setSearchTerm('');
        setSelectedCategory('all');
    };

    // Get matter slug from URL params (assuming notes are matter-specific)
    const matterSlug = searchParams.get('slugId');

    // Debug: Log the URL parameter and final slug
    console.log('URL search params:', Object.fromEntries(searchParams.entries()));
    console.log('Extracted matter slug:', matterSlug);

    // Fetch categories from API
    useQuery({
        queryKey: ['notesMeta'],
        queryFn: async () => {
            const response = await getNotesMeta()
            console.log("response >>>>", response)
            if (response?.Apistatus) {
                const categories = response.note_categories.map(cat => ({
                    id: cat.id.toString(),
                    name: cat.name
                }));
                setCategories(categories)
                setSelectedCategory(categories[0].id)
            }
        },
    });

    // Fetch notes
    const { data: notes = [], isLoading } = useQuery({
        queryKey: ['notes', matterSlug],
        queryFn: () => getNotes(matterSlug),
        staleTime: 5 * 60 * 1000,
        select: (data) => data?.data || []
    });
    console.log("notes >>>>", notes)

    // Create note mutation
    const createNoteMutation = useMutation({
        mutationFn: (noteData) => createNote(matterSlug, noteData),
        onSuccess: (response) => {
            console.log("response >>>>", response)
            toast.success('Note created successfully!');
            queryClient.invalidateQueries(['notes', matterSlug]);
            clearStates();
        },
        onError: (error) => {
            console.error('Create note error:', error);
            toast.error(error?.response?.data?.message || 'Failed to create note');
        }
    });

    // Update note mutation
    const updateNoteMutation = useMutation({
        mutationFn: ({ noteId, noteData }) => updateNote(noteId, noteData),
        onSuccess: () => {
            toast.success('Note updated successfully!');
            queryClient.invalidateQueries(['notes', matterSlug]);
            clearStates();
        },
        onError: (error) => {
            console.error('Update note error:', error);
            toast.error(error?.response?.data?.message || 'Failed to update note');
        }
    });

    // Delete note mutation
    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            toast.success('Note deleted successfully!');
            queryClient.invalidateQueries(['notes', matterSlug]);
        },
        onError: (error) => {
            console.error('Delete note error:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete note');
        }
    });

    // Filter notes based on search and category
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesSearch = !searchTerm ||
                note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.body?.toLowerCase().includes(searchTerm.toLowerCase());


            return matchesSearch;
        });
    }, [notes, searchTerm]);

    const handleCreateNote = (noteData) => {
        console.log('Creating note for matter slug:', matterSlug);
        console.log('Note data:', noteData);
        createNoteMutation.mutate(noteData);
    };

    const handleDialogClose = () => {
        clearStates();
    };

    const handleUpdateNote = (noteData) => {
        if (editingNote) {
            updateNoteMutation.mutate({
                noteId: editingNote.id,
                noteData
            });
        }
    };

    const handleDeleteNote = (noteId) => {
        if (confirm('Are you sure you want to delete this note?')) {
            deleteNoteMutation.mutate(noteId);
        }
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setDialogOpen(true);
    };

    const handleViewNote = (noteId) => {
        navigate(`/dashboard/notes/${noteId}?slugId=${matterSlug}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || 'Unknown';
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Check if we have a valid slug after all hooks are defined
    if (!matterSlug) {
        console.error('No matter slug found in URL parameters!');
        return <div className="px-4">Error: No matter ID provided</div>;
    }

    return (
        <div className="px-4">
            <BreadCrumb label="Notes" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4 mb-6">
                {/* Left Side - Notes Count */}
                <h1 className="text-2xl font-bold text-gray-900">
                    Notes ({filteredNotes.length})
                </h1>

                {/* Right Side - Search, View Toggle, and Create Button */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                        <Input
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
                        <Button
                            onClick={() => setViewMode('list')}
                            size="sm"
                            variant="ghost"
                            className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                ? 'bg-[#6366F1] text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => setViewMode('grid')}
                            size="sm"
                            variant="ghost"
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                ? 'bg-[#6366F1] text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Create Note Button */}
                    <Button
                        onClick={() => {
                            setEditingNote(null);
                            setDialogOpen(true);
                        }}
                        className="bg-[#6366F1] text-white hover:bg-[#5856eb] transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Note
                    </Button>
                </div>
            </div>

            {/* Category Filter */}
            {/* <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">Loading notes...</div>
                </div>
            )}

            {/* Notes Display */}
            {!isLoading && (
                <>
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Plus size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No notes found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm || selectedCategory !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Create your first note to get started'
                                }
                            </p>
                            {!searchTerm && selectedCategory === 'all' && (
                                <Button
                                    onClick={() => {
                                        setEditingNote(null);
                                        setDialogOpen(true);
                                    }}
                                    className="bg-[#6366F1] text-white hover:bg-[#5856eb] transition-colors shadow-sm"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First Note
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                            : 'space-y-4'
                        }>
                            {filteredNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className={`bg-white rounded-lg border hover:shadow-md transition-shadow p-4 ${viewMode === 'list' ? 'flex items-center justify-between' : ''
                                        }`}
                                >
                                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className={`font-semibold text-[#40444D] ${viewMode === 'list' ? 'text-base' : 'text-lg'
                                                }`}>
                                                {note.title}
                                            </h3>
                                            {viewMode === 'grid' && (
                                                <div className="flex gap-1 ml-2">
                                                    <Button
                                                        onClick={() => handleViewNote(note.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-1 h-6 w-6 transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleEditNote(note)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="bg-green-50 text-green-600 hover:bg-green-100 p-1 h-6 w-6 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteNote(note.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="bg-red-50 text-red-600 hover:bg-red-100 p-1 h-6 w-6 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <p className={`text-gray-600 mb-3 ${viewMode === 'list' ? 'text-sm' : 'text-base'
                                            }`}>
                                            {truncateText(note.body, viewMode === 'list' ? 80 : 120)}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Tag className="h-3 w-3" />
                                                {getCategoryName(note.category_id)}
                                            </div>
                                            {note.attachments?.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Paperclip className="h-3 w-3" />
                                                    {note.attachments.length}
                                                </div>
                                            )}
                                            <div>
                                                {formatDate(note.created_at)}
                                            </div>
                                        </div>
                                    </div>

                                    {viewMode === 'list' && (
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                onClick={() => handleViewNote(note.id)}
                                                size="sm"
                                                variant="ghost"
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 h-8 w-8 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleEditNote(note)}
                                                size="sm"
                                                variant="ghost"
                                                className="bg-green-50 text-green-600 hover:bg-green-100 p-2 h-8 w-8 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteNote(note.id)}
                                                size="sm"
                                                variant="ghost"
                                                className="bg-red-50 text-red-600 hover:bg-red-100 p-2 h-8 w-8 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Create/Edit Dialog */}
            <CreateEditNoteDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
                isLoading={createNoteMutation.isPending || updateNoteMutation.isPending}
                note={editingNote}
                isEdit={!!editingNote}
                categories={categories}
            />
        </div>
    );
};

export default NotesPage; 