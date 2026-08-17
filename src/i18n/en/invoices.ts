const en_invoices = {
  pageTitle: 'Invoices & Financial Collections',
  pageSubtitle: 'Track invoices, collections, and financial payments.',
  breadcrumb: {
    home: 'Home',
    invoices: 'Invoices & Financial Collections'
  },
  stats: {
    totalInvoices: 'Total Invoices',
    paidInvoices: 'Paid Invoices',
    partiallyPaidInvoices: 'Partially Paid Invoices',
    totalInvoicedAmount: 'Total Invoiced Amount',
    totalCollections: 'Total Collections',
    totalOutstanding: 'Total Outstanding'
  },
  toolbar: {
    searchPlaceholder: 'Search by invoice number or customer name...',
    status: 'All Statuses',
    createInvoice: 'Create Invoice',
    export: 'Export Data',
    refresh: 'Refresh'
  },
  table: {
    invoiceNumber: 'Invoice No.',
    customerName: 'Customer Name',
    meterNumber: 'Meter No.',
    amount: 'Amount',
    paidAmount: 'Paid',
    remainingAmount: 'Remaining',
    createdAt: 'Created At',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    unassigned: 'Unspecified'
  },
  status: {
    paid: 'Paid',
    partially_paid: 'Partially Paid',
    unspecified: 'Unspecified'
  },
  charts: {
    monthlyComparison: 'Monthly Invoices & Collections',
    statusDistribution: 'Invoice Status Distribution',
    invoices: 'Invoices',
    collections: 'Collections'
  },
  drawer: {
    title: 'Invoice Details',
    close: 'Close',
    invoiceNumber: 'Invoice Number',
    customerName: 'Customer Name',
    outstandingBeforePayment: 'Outstanding Before Payment',
    paidAmount: 'Paid Amount',
    remainingBalance: 'Remaining Balance',
    status: 'Status',
    accountant: 'Accountant',
    paymentNotes: 'Payment Notes',
    createdAt: 'Created At',
    updatedAt: 'Last Updated',
    noNotes: 'No notes available',
    editData: 'Edit Data'
  },
  shortcuts: {
    revenueReport: 'Revenue Report',
    revenueReportDesc: 'View detailed revenue reports',
    overdueInvoices: 'Overdue Invoices',
    overdueInvoicesDesc: 'Track and collect overdue payments',
    collections: 'Collections',
    collectionsDesc: 'Manage and track daily collections',
    accountStatement: 'Account Statement',
    accountStatementDesc: 'Extract detailed customer account statements',
    viewReport: 'View Report'
  },
  pagination: {
    showing: 'Showing 1-{{count}} of {{total}} invoices'
  },
  addModal: {
    title: 'Create Invoice',
    description: 'Enter the details for the new invoice below.',
    fields: {
      customer: 'Customer',
      meter: 'Meter',
      outstandingBeforePayment: 'Outstanding Before Payment',
      paidAmount: 'Paid Amount',
      paymentNotes: 'Payment Notes'
    },
    actions: {
      cancel: 'Cancel',
      add: 'Create Invoice'
    }
  }
}

export default en_invoices
