/**
 * Virtual Ledger & Accounting System
 * Hệ thống sổ kế toán ảo để phân loại dòng tiền
 */

// ==================== ENUMS ====================

export enum AccountType {
  ASSET = 'ASSET', // Tài sản
  LIABILITY = 'LIABILITY', // Nợ phải trả
  EQUITY = 'EQUITY', // Vốn chủ sở hữu
  REVENUE = 'REVENUE', // Doanh thu
  EXPENSE = 'EXPENSE', // Chi phí
  CONTRA_ASSET = 'CONTRA_ASSET', // Tài sản đối ứng
  CONTRA_LIABILITY = 'CONTRA_LIABILITY', // Nợ đối ứng
}

export enum AccountCategory {
  // Assets (1000-1999)
  CASH = 'CASH', // Tiền mặt
  BANK = 'BANK', // Tiền gửi ngân hàng
  PAYMENT_GATEWAY = 'PAYMENT_GATEWAY', // Cổng thanh toán
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE', // Phải thu
  PREPAID = 'PREPAID', // Trả trước
  FIXED_ASSET = 'FIXED_ASSET', // Tài sản cố định
  
  // Liabilities (2000-2999)
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE', // Phải trả
  TRUST_ACCOUNT = 'TRUST_ACCOUNT', // Tài khoản ký quỹ (Thu hộ)
  TAX_PAYABLE = 'TAX_PAYABLE', // Thuế phải nộp
  ACCRUED_EXPENSE = 'ACCRUED_EXPENSE', // Chi phí phải trả
  
  // Equity (3000-3999)
  SHARE_CAPITAL = 'SHARE_CAPITAL', // Vốn góp
  RETAINED_EARNINGS = 'RETAINED_EARNINGS', // Lợi nhuận giữ lại
  
  // Revenue (4000-4999)
  PLATFORM_REVENUE = 'PLATFORM_REVENUE', // Doanh thu platform
  OTHER_INCOME = 'OTHER_INCOME', // Thu nhập khác
  
  // Expenses (5000-5999)
  OPERATING_EXPENSE = 'OPERATING_EXPENSE', // Chi phí hoạt động
  COST_OF_REVENUE = 'COST_OF_REVENUE', // Giá vốn
}

export enum LedgerType {
  GENERAL = 'GENERAL', // Sổ cái chung
  SUB_LEDGER = 'SUB_LEDGER', // Sổ chi tiết
  VIRTUAL = 'VIRTUAL', // Sổ ảo (logic separation)
}

export enum TransactionType {
  CUSTOMER_PAYMENT = 'CUSTOMER_PAYMENT', // Khách thanh toán
  MERCHANT_SETTLEMENT = 'MERCHANT_SETTLEMENT', // Thanh toán merchant
  DRIVER_SETTLEMENT = 'DRIVER_SETTLEMENT', // Thanh toán driver
  SUPPLIER_SETTLEMENT = 'SUPPLIER_SETTLEMENT', // Thanh toán supplier
  TAX_REMITTANCE = 'TAX_REMITTANCE', // Nộp thuế
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản
  REFUND = 'REFUND', // Hoàn tiền
  ADJUSTMENT = 'ADJUSTMENT', // Điều chỉnh
}

export enum ReconciliationStatus {
  MATCHED = 'MATCHED', // Khớp
  UNMATCHED = 'UNMATCHED', // Chưa khớp
  DISCREPANCY = 'DISCREPANCY', // Chênh lệch
  PENDING = 'PENDING', // Chờ đối soát
}

// ==================== CHART OF ACCOUNTS ====================

/**
 * Chart of Accounts - Hệ thống tài khoản kế toán
 */
export interface ChartOfAccounts {
  accountCode: string; // "1100", "4200", etc.
  accountName: string;
  accountType: AccountType;
  category: AccountCategory;
  ledgerType: LedgerType;
  
  // Hierarchy
  parentAccountCode?: string; // Parent account for sub-accounts
  level: number; // 1 = main, 2 = sub, 3 = detail
  
  // Virtual account properties
  isVirtual: boolean; // true = logic separation only
  isTrustAccount: boolean; // true = thu hộ account
  
  // Balance properties
  normalBalance: 'DEBIT' | 'CREDIT';
  currentBalance: number; // VND (can be negative)
  
  // Restrictions
  allowsPosting: boolean; // Can post entries to this account?
  requiresReconciliation: boolean; // Needs bank reconciliation?
  
  // Metadata
  description: string;
  notes?: string;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Standard Chart of Accounts for Lifestyle Platform
 */
export const STANDARD_CHART_OF_ACCOUNTS: ChartOfAccounts[] = [
  // ========== ASSETS (1000-1999) ==========
  
  // 1100: Cash & Bank
  {
    accountCode: '1100',
    accountName: 'Cash & Bank Accounts',
    accountType: AccountType.ASSET,
    category: AccountCategory.BANK,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'DEBIT',
    allowsPosting: false,
    requiresReconciliation: false,
    description: 'All cash and bank accounts',
  },
  {
    accountCode: '1110',
    accountName: 'Operating Bank Account',
    accountType: AccountType.ASSET,
    category: AccountCategory.BANK,
    ledgerType: LedgerType.GENERAL,
    parentAccountCode: '1100',
    level: 2,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: true,
    description: 'Main operating bank account (physical)',
    notes: 'Vietcombank - 0123456789 - Physical account',
  },
  {
    accountCode: '1111',
    accountName: 'Virtual Ledger - Platform Revenue',
    accountType: AccountType.ASSET,
    category: AccountCategory.BANK,
    ledgerType: LedgerType.VIRTUAL,
    parentAccountCode: '1110',
    level: 3,
    isVirtual: true,
    isTrustAccount: false,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Virtual account tracking platform revenue portion',
    notes: 'Logic separation - not a physical bank account',
  },
  {
    accountCode: '1112',
    accountName: 'Virtual Ledger - Merchant Trust',
    accountType: AccountType.ASSET,
    category: AccountCategory.BANK,
    ledgerType: LedgerType.VIRTUAL,
    parentAccountCode: '1110',
    level: 3,
    isVirtual: true,
    isTrustAccount: true,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Virtual account tracking merchant collections (thu hộ)',
  },
  {
    accountCode: '1113',
    accountName: 'Virtual Ledger - Driver Trust',
    accountType: AccountType.ASSET,
    category: AccountCategory.BANK,
    ledgerType: LedgerType.VIRTUAL,
    parentAccountCode: '1110',
    level: 3,
    isVirtual: true,
    isTrustAccount: true,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Virtual account tracking driver collections (thu hộ)',
  },
  {
    accountCode: '1114',
    accountName: 'Virtual Ledger - Supplier Trust',
    accountType: AccountType.ASSET,
    category: AccountCategory.BANK,
    ledgerType: LedgerType.VIRTUAL,
    parentAccountCode: '1110',
    level: 3,
    isVirtual: true,
    isTrustAccount: true,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Virtual account tracking supplier collections (voucher thu hộ)',
  },
  {
    accountCode: '1115',
    accountName: 'Virtual Ledger - Tax Trust',
    accountType: AccountType.ASSET,
    category: AccountCategory.BANK,
    ledgerType: LedgerType.VIRTUAL,
    parentAccountCode: '1110',
    level: 3,
    isVirtual: true,
    isTrustAccount: true,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Virtual account tracking tax withholding',
  },
  
  // 1200: Payment Gateway Receivables
  {
    accountCode: '1200',
    accountName: 'Payment Gateway Receivables',
    accountType: AccountType.ASSET,
    category: AccountCategory.PAYMENT_GATEWAY,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: true,
    description: 'Money in payment gateways (pending settlement)',
  },
  
  // ========== LIABILITIES (2000-2999) ==========
  
  // 2100: Merchant Payables
  {
    accountCode: '2100',
    accountName: 'Merchant Payables',
    accountType: AccountType.LIABILITY,
    category: AccountCategory.ACCOUNTS_PAYABLE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: true,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: true,
    description: 'Amounts owed to merchants (thu hộ)',
  },
  
  // 2200: Driver Payables
  {
    accountCode: '2200',
    accountName: 'Driver Payables',
    accountType: AccountType.LIABILITY,
    category: AccountCategory.ACCOUNTS_PAYABLE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: true,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: true,
    description: 'Amounts owed to drivers (thu hộ)',
  },
  
  // 2300: Supplier Payables
  {
    accountCode: '2300',
    accountName: 'Supplier Payables',
    accountType: AccountType.LIABILITY,
    category: AccountCategory.ACCOUNTS_PAYABLE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: true,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: true,
    description: 'Amounts owed to suppliers (voucher thu hộ)',
  },
  
  // 2400: Tax Payables
  {
    accountCode: '2400',
    accountName: 'Tax Payables',
    accountType: AccountType.LIABILITY,
    category: AccountCategory.TAX_PAYABLE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: true,
    normalBalance: 'CREDIT',
    allowsPosting: false,
    requiresReconciliation: true,
    description: 'Tax withholding payable to authority',
  },
  {
    accountCode: '2410',
    accountName: 'VAT Payable',
    accountType: AccountType.LIABILITY,
    category: AccountCategory.TAX_PAYABLE,
    ledgerType: LedgerType.SUB_LEDGER,
    parentAccountCode: '2400',
    level: 2,
    isVirtual: false,
    isTrustAccount: true,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'VAT withheld from drivers',
  },
  {
    accountCode: '2420',
    accountName: 'PIT Payable',
    accountType: AccountType.LIABILITY,
    category: AccountCategory.TAX_PAYABLE,
    ledgerType: LedgerType.SUB_LEDGER,
    parentAccountCode: '2400',
    level: 2,
    isVirtual: false,
    isTrustAccount: true,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'PIT (TNCN) withheld from drivers',
  },
  
  // ========== REVENUE (4000-4999) ==========
  
  // 4100: Platform Fee Revenue
  {
    accountCode: '4100',
    accountName: 'Platform Fee Revenue',
    accountType: AccountType.REVENUE,
    category: AccountCategory.PLATFORM_REVENUE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Fixed platform fee (2,000 VND per transaction)',
  },
  
  // 4200: Driver Commission Revenue
  {
    accountCode: '4200',
    accountName: 'Driver Commission Revenue',
    accountType: AccountType.REVENUE,
    category: AccountCategory.PLATFORM_REVENUE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Commission from driver services (15%)',
  },
  
  // 4300: Merchant Commission Revenue
  {
    accountCode: '4300',
    accountName: 'Merchant Commission Revenue',
    accountType: AccountType.REVENUE,
    category: AccountCategory.PLATFORM_REVENUE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Commission from merchant sales (15%)',
  },
  
  // 4400: Subscription Revenue
  {
    accountCode: '4400',
    accountName: 'Subscription Revenue',
    accountType: AccountType.REVENUE,
    category: AccountCategory.PLATFORM_REVENUE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Premium subscription fees',
  },
  
  // 4500: Advertising Revenue
  {
    accountCode: '4500',
    accountName: 'Advertising Revenue',
    accountType: AccountType.REVENUE,
    category: AccountCategory.PLATFORM_REVENUE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Merchant advertising fees',
  },
  
  // 4600: Voucher Markup Revenue
  {
    accountCode: '4600',
    accountName: 'Voucher Markup Revenue',
    accountType: AccountType.REVENUE,
    category: AccountCategory.PLATFORM_REVENUE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'CREDIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Markup on voucher/tour sales',
  },
  
  // ========== EXPENSES (5000-5999) ==========
  
  // 5100: Payment Gateway Fees
  {
    accountCode: '5100',
    accountName: 'Payment Gateway Fees',
    accountType: AccountType.EXPENSE,
    category: AccountCategory.COST_OF_REVENUE,
    ledgerType: LedgerType.GENERAL,
    level: 1,
    isVirtual: false,
    isTrustAccount: false,
    normalBalance: 'DEBIT',
    allowsPosting: true,
    requiresReconciliation: false,
    description: 'Fees charged by payment gateways',
  },
];

// ==================== JOURNAL ENTRIES ====================

/**
 * Journal Entry - Bút toán kế toán
 */
export interface JournalEntry {
  entryId: string;
  entryDate: Date;
  transactionType: TransactionType;
  
  // Reference
  referenceId: string; // Order ID, Settlement ID, etc.
  referenceType: string; // "ORDER", "SETTLEMENT", etc.
  
  // Entry lines
  lines: JournalEntryLine[];
  
  // Totals
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean; // totalDebit === totalCredit
  
  // Status
  status: 'DRAFT' | 'POSTED' | 'REVERSED' | 'VOIDED';
  postedAt?: Date;
  postedBy?: string;
  
  // Reversal
  reversedBy?: string; // Entry ID of reversal
  reversalOf?: string; // Entry ID being reversed
  reversalReason?: string;
  
  // Metadata
  description: string;
  notes?: string;
  
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

/**
 * Journal Entry Line - Dòng bút toán
 */
export interface JournalEntryLine {
  lineId: string;
  accountCode: string;
  accountName: string;
  
  // Amount
  debit: number; // VND (0 if credit)
  credit: number; // VND (0 if debit)
  
  // Sub-ledger detail
  partnerId?: string; // Merchant ID, Driver ID, etc.
  partnerType?: 'MERCHANT' | 'DRIVER' | 'SUPPLIER' | 'CUSTOMER';
  partnerName?: string;
  
  // Virtual account tracking
  virtualAccountCode?: string; // "1111", "1112", etc.
  isVirtual: boolean;
  isTrustAccount: boolean;
  
  // Metadata
  description: string;
  tags?: string[]; // For filtering/grouping
}

// ==================== VIRTUAL LEDGER BALANCES ====================

/**
 * Virtual Ledger Balance
 * Balance theo từng virtual account
 */
export interface VirtualLedgerBalance {
  accountCode: string; // "1111", "1112", etc.
  accountName: string;
  
  // Balance
  currentBalance: number; // VND
  availableBalance: number; // After pending settlements
  
  // Breakdown
  inflow: number; // Total deposits
  outflow: number; // Total withdrawals
  pendingInflow: number;
  pendingOutflow: number;
  
  // Period
  asOfDate: Date;
  
  // Metadata
  isTrustAccount: boolean;
  lastReconciled?: Date;
}

/**
 * Physical vs Virtual Reconciliation
 * Đối soát giữa tài khoản vật lý và virtual
 */
export interface BankReconciliation {
  id: string;
  reconciliationDate: Date;
  period: string; // "2024-02"
  
  // Physical bank account
  physicalBankAccount: {
    accountNumber: string;
    bankName: string;
    bankBalance: number; // From bank statement
    lastTransactionDate: Date;
  };
  
  // Virtual accounts
  virtualAccounts: {
    accountCode: string;
    accountName: string;
    balance: number;
  }[];
  
  // Totals
  totalVirtualBalance: number; // Sum of all virtual accounts
  physicalBankBalance: number; // From bank
  
  // Reconciliation
  difference: number; // Should be 0
  status: ReconciliationStatus;
  
  // Discrepancy details (if any)
  discrepancies?: {
    description: string;
    amount: number;
    reason?: string;
  }[];
  
  // Metadata
  reconciledBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SUB-LEDGER ====================

/**
 * Merchant Sub-Ledger
 * Sổ chi tiết theo merchant
 */
export interface MerchantSubLedger {
  merchantId: string;
  merchantName: string;
  
  // Account
  ledgerAccountCode: '2100'; // Merchant Payables
  
  // Balance
  currentBalance: number; // Amount owed to merchant
  
  // Transactions
  transactions: SubLedgerTransaction[];
  
  // Period
  asOfDate: Date;
}

/**
 * Driver Sub-Ledger
 * Sổ chi tiết theo driver
 */
export interface DriverSubLedger {
  driverId: string;
  driverName: string;
  
  // Account
  ledgerAccountCode: '2200'; // Driver Payables
  
  // Balance
  currentBalance: number; // Amount owed to driver
  
  // Transactions
  transactions: SubLedgerTransaction[];
  
  // Period
  asOfDate: Date;
}

/**
 * Sub-Ledger Transaction
 * Chi tiết giao dịch trong sổ con
 */
export interface SubLedgerTransaction {
  transactionId: string;
  transactionDate: Date;
  
  // Journal reference
  journalEntryId: string;
  
  // Amount
  debit: number;
  credit: number;
  runningBalance: number; // Balance after this transaction
  
  // Description
  description: string;
  referenceId: string; // Order ID, Settlement ID, etc.
}

// ==================== RECONCILIATION DASHBOARD ====================

/**
 * Reconciliation Dashboard Data
 * Dữ liệu dashboard cho kế toán đối soát
 */
export interface ReconciliationDashboard {
  period: string; // "2024-02"
  asOfDate: Date;
  
  // Physical bank balance
  physicalBankBalance: number;
  
  // Virtual account breakdown
  virtualAccounts: {
    platformRevenue: {
      accountCode: '1111';
      balance: number;
      percentage: number; // % of total
    };
    merchantTrust: {
      accountCode: '1112';
      balance: number;
      percentage: number;
      pendingSettlements: number;
    };
    driverTrust: {
      accountCode: '1113';
      balance: number;
      percentage: number;
      pendingSettlements: number;
    };
    supplierTrust: {
      accountCode: '1114';
      balance: number;
      percentage: number;
      pendingSettlements: number;
    };
    taxTrust: {
      accountCode: '1115';
      balance: number;
      percentage: number;
      nextRemittanceDate: Date;
    };
  };
  
  // Total virtual vs physical
  totalVirtualBalance: number;
  reconciliationDifference: number; // Should be 0
  isReconciled: boolean;
  
  // Pending items
  pendingInflows: {
    description: string;
    amount: number;
    expectedDate: Date;
  }[];
  
  pendingOutflows: {
    description: string;
    amount: number;
    scheduledDate: Date;
  }[];
  
  // Cash flow projection
  projectedBalance: {
    today: number;
    in7Days: number;
    in30Days: number;
  };
  
  // Alerts
  alerts: {
    type: 'ERROR' | 'WARNING' | 'INFO';
    message: string;
    action?: string;
  }[];
}

// ==================== CASH FLOW TRACKING ====================

/**
 * Cash Flow Statement Data
 * Báo cáo lưu chuyển tiền tệ
 */
export interface CashFlowStatement {
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  // Operating Activities
  operatingActivities: {
    platformRevenueCollected: number; // Platform fee + commission + markup
    merchantPaymentsMade: number; // Payments to merchants
    driverPaymentsMade: number; // Payments to drivers
    supplierPaymentsMade: number; // Payments to suppliers
    taxRemittances: number; // Tax payments
    operatingExpenses: number; // Salaries, marketing, etc.
    netCashFromOperations: number; // Sum of above
  };
  
  // Investing Activities
  investingActivities: {
    capitalExpenditures: number; // Equipment, software
    netCashFromInvesting: number;
  };
  
  // Financing Activities
  financingActivities: {
    loanProceeds: number;
    loanRepayments: number;
    equityInvestment: number;
    dividendsPaid: number;
    netCashFromFinancing: number;
  };
  
  // Net change
  netCashChange: number; // Sum of all activities
  
  // Beginning & ending balance
  beginningCashBalance: number;
  endingCashBalance: number; // Beginning + netCashChange
  
  // Verification
  isBalanced: boolean; // endingCashBalance === physical bank balance
}

// ==================== API TYPES ====================

export interface GetChartOfAccountsRequest {
  includeInactive?: boolean;
  accountType?: AccountType;
  category?: AccountCategory;
}

export interface GetChartOfAccountsResponse {
  accounts: ChartOfAccounts[];
}

export interface PostJournalEntryRequest {
  transactionType: TransactionType;
  referenceId: string;
  referenceType: string;
  entryDate: Date;
  lines: Omit<JournalEntryLine, 'lineId'>[];
  description: string;
  notes?: string;
}

export interface PostJournalEntryResponse {
  entry: JournalEntry;
  posted: boolean;
  errors?: string[];
}

export interface GetVirtualLedgerBalancesRequest {
  asOfDate?: Date;
}

export interface GetVirtualLedgerBalancesResponse {
  balances: VirtualLedgerBalance[];
  totalBalance: number;
}

export interface GetReconciliationDashboardRequest {
  period: string; // "2024-02"
}

export interface GetReconciliationDashboardResponse {
  dashboard: ReconciliationDashboard;
}

export interface PerformBankReconciliationRequest {
  reconciliationDate: Date;
  bankStatementBalance: number;
  bankStatementDate: Date;
}

export interface PerformBankReconciliationResponse {
  reconciliation: BankReconciliation;
  isReconciled: boolean;
  discrepancies?: any[];
}

export interface GetSubLedgerRequest {
  partnerId: string;
  partnerType: 'MERCHANT' | 'DRIVER' | 'SUPPLIER';
  startDate?: Date;
  endDate?: Date;
}

export interface GetSubLedgerResponse {
  subLedger: MerchantSubLedger | DriverSubLedger;
}

export interface GetCashFlowStatementRequest {
  startDate: Date;
  endDate: Date;
}

export interface GetCashFlowStatementResponse {
  statement: CashFlowStatement;
}
