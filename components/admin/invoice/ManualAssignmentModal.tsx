import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/ui/modal/modal';
import Input from '@/ui/Input';
import Calendar from '@/ui/Calendar';
import css from '@/styles/admin/components/manualAssignment.module.scss';
import { useManualAssignmentStore } from '@/store/manualAssignmentStore';

interface ManualAssignment {
    id: string;
    title: string;
    type: string;
    pm: string;
    deadline: string;
    completion_date: string;
    wordcount: number;
    amount: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (assignments: ManualAssignment[]) => void;
    isAdmin?: boolean; // New prop to determine if it's admin view
}

const ManualAssignmentModal: React.FC<Props> = ({ isOpen, onClose, onAdd, isAdmin = false }) => {
    const [localAssignments, setLocalAssignments] = useState<ManualAssignment[]>([]);
    const { lastId, setLastId } = useManualAssignmentStore();
    const [currentAssignment, setCurrentAssignment] = useState<ManualAssignment>({
        id: '',
        title: '',
        type: '',
        pm: '',
        deadline: '',
        completion_date: '',
        wordcount: 0,
        amount: 0
    });
    const [showDeadlineCalendar, setShowDeadlineCalendar] = useState(false);
    const [showCompletionCalendar, setShowCompletionCalendar] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const calendarWrapperRef = useRef<HTMLDivElement>(null);

    // Add click outside handler
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            // Close calendar if click is outside the calendar and the input
            if (
                showDeadlineCalendar || 
                showCompletionCalendar
            ) {
                const target = event.target as HTMLElement;
                const isCalendarClick = target.closest(`.${css.calendarWrapper}`);
                const isInputClick = target.closest('input');

                if (!isCalendarClick && !isInputClick) {
                    setShowDeadlineCalendar(false);
                    setShowCompletionCalendar(false);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [showDeadlineCalendar, showCompletionCalendar]);

    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    const validateId = (id: string): boolean => {
        // Check if ID starts with 'A' and followed by numbers
        return /^A\d+$/.test(id);
    };

    const getNextId = () => {
        // Use the lastId from store
        const nextId = lastId + 1;
        setLastId(nextId);
        return `A${nextId}`;
    };

    const addNewAssignment = () => {
        if (!currentAssignment.title || !currentAssignment.amount) {
            return;
        }

        let assignmentId = currentAssignment.id;

        if (isAdmin) {
            if (!assignmentId) {
                assignmentId = getNextId();
            } else if (!validateId(assignmentId)) {
                alert("ID must start with 'A' followed by numbers (e.g., A1, A2)");
                return;
            } else if (localAssignments.some(a => a.id === assignmentId)) {
                alert("This ID already exists");
                return;
            }
        } else {
            assignmentId = getNextId();
        }

        const newAssignment = { ...currentAssignment, id: assignmentId };
        setLocalAssignments([...localAssignments, newAssignment]);
        setCurrentAssignment({
            id: '',
            title: '',
            type: '',
            pm: '',
            deadline: '',
            completion_date: '',
            wordcount: 0,
            amount: 0
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isMinimal style={{ width: 'fit-content' }}>
            <div className={css.container} ref={modalRef}>
                <div className={css.modalHeader}>
                    <h2>Add Manual Assignment</h2>
                </div>

                <div className={css.modalBody}>
                    <div className={css.formGroup}>
                        {isAdmin && (
                            <Input
                                placeholder="Assignment ID (e.g., A1)"
                                value={currentAssignment.id}
                                onChange={(e) => setCurrentAssignment({
                                    ...currentAssignment,
                                    id: e.target.value
                                })}
                                label="ID (Optional)"
                            />
                        )}
                        <Input
                            placeholder="Assignment Title"
                            value={currentAssignment.title}
                            onChange={(e) => setCurrentAssignment({
                                ...currentAssignment,
                                title: e.target.value
                            })}
                            label="Title"
                            required
                        />

                        <Input
                            placeholder="Eg. Essay Writing"
                            value={currentAssignment.type}
                            onChange={(e) => setCurrentAssignment({
                                ...currentAssignment,
                                type: e.target.value
                            })}
                            label="Type"
                        />

                        <Input
                            placeholder="Project Manager"
                            value={currentAssignment.pm}
                            onChange={(e) => setCurrentAssignment({
                                ...currentAssignment,
                                pm: e.target.value
                            })}
                            label="PM Name"
                        />

                        <div className={css.dateField}>
                            <Input
                                placeholder="Select Completion Date"
                                value={formatDate(currentAssignment.completion_date)}
                                onClick={() => {
                                    setShowDeadlineCalendar(false);
                                    setShowCompletionCalendar(true);
                                }}
                                label="Completion Date"
                                readOnly
                            />
                            {showCompletionCalendar && (
                                <div className={css.calendarWrapper}>
                                    <Calendar
                                        onChange={(date) => {
                                            setCurrentAssignment({
                                                ...currentAssignment,
                                                completion_date: date.toISOString()
                                            });
                                            setShowCompletionCalendar(false);
                                        }}
                                        setShow={setShowCompletionCalendar}
                                        className={css.calendarTwo}
                                        allowPasteDate={true}
                                    />
                                </div>
                            )}
                        </div>

                        <Input
                            placeholder="Word Count"
                            value={currentAssignment.wordcount || ''}
                            onChange={(e) => setCurrentAssignment({
                                ...currentAssignment,
                                wordcount: parseInt(e.target.value) || 0
                            })}
                            type="number"
                            label="Word Count"
                            restrictToNumeric
                        />

                        <Input
                            placeholder="Amount"
                            value={currentAssignment.amount || ''}
                            onChange={(e) => setCurrentAssignment({
                                ...currentAssignment,
                                amount: parseInt(e.target.value) || 0
                            })}
                            type="number"
                            label="Amount"
                            required
                            restrictToNumeric
                        />

                        <button onClick={addNewAssignment}>Add More</button>
                    </div>

                    <div className={css.assignmentList}>
                        {localAssignments.map((assignment, index) => (
                            <div key={assignment.id} className={css.assignmentItem}>
                                <span className={css.id}>{assignment.id}</span>
                                <span className={css.title}>{assignment.title}</span>
                                <span className={css.cost}>₹{assignment.amount.toLocaleString('en-IN')}</span>
                                <button onClick={() => {
                                    setLocalAssignments(localAssignments.filter((_, i) => i !== index));
                                }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={css.modalFooter}>
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={() => {
                            onAdd(localAssignments);
                            setLocalAssignments([]);
                            onClose();
                        }}
                        disabled={localAssignments.length === 0}
                    >
                        Add {localAssignments.length} Assignment{localAssignments.length !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ManualAssignmentModal;
