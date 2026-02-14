import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useToast } from '@/context/toastContext';
import SearchBar from '@/components/admin/searchbar/searchbar';
import PaginationBar from '@/components/admin/paginationBar/paginationBar';
import { debounce } from '@/utils/debounce';
import useThrottleFunction from '@/utils/throttle';
import { BalanceService } from '@/services/balanceService';
import { 
  TransactionData, 
  TransactionReason, 
  WithdrawalType 
} from '@/types/transactionTypes';
import AddBalanceModal from './modals/addBalanceModal';
import WithdrawBalanceModal from './modals/withdrawBalanceModal';

import '@/globalStyles/table.scss';
import css from './transactionHistory.module.scss';

interface TransactionHistoryProps {
  studentId: string | number;
  baseURL: string;
  userToken?: string;
  userAssignments?: Array<{ id: number; title: string; }>;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  studentId,
  baseURL,
  userToken,
  userAssignments = []
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState<string>('');
  
  // Load transaction data
  const loadTransactions = async () => {
    if (!userToken || !studentId) return;
    
    setLoading(true);
    try {
      const response = await BalanceService.getTransactionHistory(baseURL, userToken, studentId);
      setTransactions(response.data);
      updatePagination(response.data, 1);
      setLoading(false);
    } catch (error) {
      console.error('Error loading transactions:', error);
      showToast('Failed to load transaction history', 'error');
      setLoading(false);
    }
  };

  // Search transactions
  const searchTransactions = async (term: string) => {
    if (!userToken || !studentId || !term) {
      loadTransactions();
      return;
    }
    
    setLoading(true);
    try {
      const response = await BalanceService.searchTransactionHistory(baseURL, userToken, studentId, term);
      setTransactions(response.data);
      updatePagination(response.data, 1);
      setLoading(false);
    } catch (error) {
      console.error('Error searching transactions:', error);
      showToast('Failed to search transactions', 'error');
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useRef(debounce(searchTransactions, 300)).current;
  const throttledSearch = useThrottleFunction(searchTransactions, 1000);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
    throttledSearch(term);
  };

  // Handle pagination
  const updatePagination = (data: TransactionData[], page: number) => {
    const filteredData = filterTransactions(data);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filteredData.slice(startIndex, endIndex);
    
    setFilteredTransactions(paginatedItems);
    setTotalPages(Math.ceil(filteredData.length / pageSize));
    setCurrentPage(page);
  };

  // Apply filters
  const filterTransactions = (data: TransactionData[]) => {
    let filteredData = [...data];
    
    if (filterType) {
      filteredData = filteredData.filter(item => item.transaction_type === filterType);
    }
    
    return filteredData;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updatePagination(transactions, page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    updatePagination(transactions, 1);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    updatePagination(transactions, 1);
  };

  // Balance operations
  const handleAddBalance = async (
    amount: number,
    reason: string,
    description: string,
    assignmentId?: string
  ) => {
    if (!userToken || !studentId) return;
    
    try {
      const response = await BalanceService.addBalance(
        baseURL,
        userToken,
        studentId,
        amount,
        reason,
        description,
        assignmentId
      );
      
      showToast(response.message || 'Balance added successfully', 'success');
      setIsAddModalOpen(false);
      loadTransactions();
    } catch (error: any) {
      showToast(error.message || 'Failed to add balance', 'error');
    }
  };

  const handleWithdrawBalance = async (
    amount: number,
    withdrawalType: WithdrawalType,
    description: string,
    assignmentId?: string
  ) => {
    if (!userToken || !studentId) return;
    
    try {
      const response = await BalanceService.withdrawBalance(
        baseURL,
        userToken,
        studentId,
        amount,
        withdrawalType,
        description,
        assignmentId
      );
      
      showToast(response.message || 'Balance withdrawn successfully', 'success');
      setIsWithdrawModalOpen(false);
      loadTransactions();
    } catch (error: any) {
      showToast(error.message || 'Failed to withdraw balance', 'error');
    }
  };

  // Cell renderers
  const transactionTypeRenderer = (params: any) => {
    const type = params.value;
    return (
      <div className={`${css.typeChip} ${type === 'CREDIT' ? css.credit : css.debit}`}>
        {type === 'CREDIT' ? 'Credit' : 'Debit'}
      </div>
    );
  };

  const amountRenderer = (params: any) => {
    const amount = params.value;
    const isCredit = params.data.transaction_type === 'CREDIT';
    const formattedAmount = Math.abs(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });
    
    return (
      <div className={`${css.amount} ${isCredit ? css.creditAmount : css.debitAmount}`}>
        {isCredit ? `+${formattedAmount}` : `-${formattedAmount}`}
      </div>
    );
  };

  const dateRenderer = (params: any) => {
    const date = new Date(params.value);
    return (
      <div className={css.dateInfo}>
        {date.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        })}
        <div className={css.timeInfo}>
          {date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    );
  };

  const assignmentRenderer = (params: any) => {
    const assignmentId = params.value;
    if (!assignmentId) return <span>-</span>;
    
    return (
      <span 
        className={css.assignmentLink}
        onClick={() => router.push(`/admin/assignments/details?id=${assignmentId}`)}
      >
        #{assignmentId}
      </span>
    );
  };

  const reasonRenderer = (params: any) => {
    const reason = params.value;
    if (!reason) return <span>-</span>;
    
    const reasonLabels: Record<string, string> = {
      'REFERRAL': 'Referral',
      'BONUS': 'Bonus',
      'DISCOUNT': 'Discount',
      'REFUND': 'Refund',
      'OTHER': 'Other'
    };
    
    return <span>{reasonLabels[reason] || reason}</span>;
  };

  // Column definitions
  const columnDefs: ColDef[] = [
    { 
      headerName: 'ID', 
      field: 'transaction_id', 
      sortable: true, 
      width: 80 
    },
    { 
      headerName: 'Type', 
      field: 'transaction_type', 
      cellRenderer: transactionTypeRenderer,
      sortable: true, 
      width: 100 
    },
    { 
      headerName: 'Amount', 
      field: 'amount', 
      cellRenderer: amountRenderer,
      sortable: true, 
      width: 120 
    },
    { 
      headerName: 'Description', 
      field: 'description', 
      sortable: true,
      width: 230
    },
    { 
      headerName: 'Reason', 
      field: 'reason', 
      cellRenderer: reasonRenderer,
      sortable: true,
      width: 100
    },
    { 
      headerName: 'Credit Assignment', 
      field: 'credited_assignment_id', 
      cellRenderer: assignmentRenderer,
      sortable: true,
      width: 140
    },
    { 
      headerName: 'Debit Assignment', 
      field: 'debited_assignment_id', 
      cellRenderer: assignmentRenderer,
      sortable: true,
      width: 140
    },
    { 
      headerName: 'Date', 
      field: 'created_at', 
      cellRenderer: dateRenderer,
      sortable: true,
      width: 150
    }
  ];

  // Default column definition
  const defaultColDef = {
    resizable: true,
    sortable: true,
    suppressMovable: true,
  };

  // Grid options
  const gridOptions = {
    rowHeight: 48,
    headerHeight: 48,
    rowClass: css.row,
    suppressCellFocus: true,
  };

  // Load transactions on mount
  useEffect(() => {
    if (userToken && studentId) {
      loadTransactions();
    }
  }, [userToken, studentId]);

  // Update pagination when filters change
  useEffect(() => {
    if (transactions.length > 0) {
      updatePagination(transactions, 1);
    }
  }, [filterType, pageSize]);

  return (
    <>
      <AddBalanceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBalance}
        userAssignments={userAssignments}
      />
      
      <WithdrawBalanceModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSubmit={handleWithdrawBalance as any}
        userAssignments={userAssignments}
      />

      <div className={css.header}>
        <h2>Transaction History</h2>
        <div className={css.actions}>
          <button 
            className={`${css.button} ${css.secondary}`}
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            <span className={css.icon}>-</span>
            Withdraw
          </button>
          <button 
            className={`${css.button} ${css.primary}`}
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className={css.icon}>+</span>
            Add Balance
          </button>
        </div>
      </div>
      
      <div className={css.container}>
        <div className={css.toolbar}>
          <div className={css.search}>
            <SearchBar
              searchText={searchTerm}
              handleSearchChange={handleSearch}
              setSearchText={setSearchTerm}
              options={["ID", "Type", "Amount", "Description"]}
            />
          </div>
          
          <div className={css.filters}>
            <select 
              value={filterType} 
              onChange={(e) => handleFilterChange(e.target.value)}
              className={css.filterSelect}
            >
              <option value="">All Types</option>
              <option value="CREDIT">Credits Only</option>
              <option value="DEBIT">Debits Only</option>
            </select>
          </div>
        </div>
        
        <div className={`ag-theme-alpine ${css.grid}`}>
          {loading ? (
            <div className={css.loading}>Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className={css.empty}>No transactions found</div>
          ) : (
            <AgGridReact
              rowData={filteredTransactions}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={gridOptions}
              domLayout="autoHeight"
            />
          )}
        </div>
        
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onNextPage={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          onPreviousPage={() => handlePageChange(Math.max(currentPage - 1, 1))}
        />
      </div>
    </>
  );
};

export default TransactionHistory;