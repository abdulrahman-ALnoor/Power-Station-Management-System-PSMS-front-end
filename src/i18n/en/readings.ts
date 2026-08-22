const en_readings = {
  pageTitle: 'Meter Readings',
  pageSubtitle: 'Manage meter readings, consumption, and reading costs.',
  breadcrumb: {
    home: 'Home',
    readings: 'Meter Readings',
  },
  stats: {
    totalReadings: 'Total Readings',
    approvedReadings: 'Approved Readings',
    pendingReadings: 'Pending Readings',
    rejectedReadings: 'Rejected Readings',
    totalConsumption: 'Total Consumption',
    totalReadingCost: 'Total Reading Cost',
  },
  toolbar: {
    searchPlaceholder: 'Search by meter number or customer name...',
    filters: {
      status: {
        all: 'All Statuses',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      month: {
        all: 'All Months',
        thisMonth: 'This Month',
      },
    },
    actions: {
      addReading: 'Add Reading',
      refresh: 'Refresh',
    },
  },
  table: {
    columns: {
      readingId: 'Reading #',
      meterNumber: 'Meter Number',
      customer: 'Customer',
      previousReading: 'Previous Reading',
      currentReading: 'Current Reading',
      consumption: 'Consumption',
      pricePerKwh: 'Price / kWh',
      readingCost: 'Cost',
      readingDate: 'Reading Date',
      method: 'Method',
      status: 'Status',
      actions: 'Actions',
    },
    emptyState: {
      title: 'No readings found',
      description: 'Adjust the search filters or add a new reading.',
    },
  },
  status: {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    unspecified: 'Unspecified',
  },
  method: {
    manual: 'Manual',
    qr_scan: 'QR Scan',
    unspecified: 'Unspecified',
  },
  details: {
    title: 'Reading Details',
    customer: 'Customer',
    notes: 'Notes',
    createdBy: 'Recorded By',
    createdAt: 'Created At',
  },
  addModal: {
    title: 'Add New Reading',
    editTitle: 'Edit Reading',
    description: 'Enter the new reading details. Consumption and cost are calculated automatically by the backend.',
    editDescription: 'Only the most recent reading for a meter can be edited, and only if no invoice is linked to it yet.',
    meterSelect: 'Select a meter',
    actions: {
      cancel: 'Cancel',
      add: 'Add Reading',
      update: 'Save Changes',
      saving: 'Saving...',
    },
  },
  actions: {
    viewDetails: 'View Details',
    edit: 'Edit Reading',
    delete: 'Delete Reading',
    approve: 'Approve',
    reject: 'Reject',
  },
  notifications: {
    added: 'Reading added successfully.',
    updated: 'Reading updated successfully.',
    deleted: 'Reading deleted successfully.',
    statusUpdated: 'Reading status updated successfully.',
  },
  loading: 'Loading...',
  deleteConfirm: 'Are you sure you want to delete this reading?',
  pagination: {
    showing: 'Showing {{count}} of {{total}} readings',
  },
  errors: {
    loadFailed: 'Failed to load readings. Make sure the backend server is running.',
    statsFailed: 'Failed to load reading statistics.',
    saveFailed: 'Failed to save reading.',
    deleteFailed: 'Failed to delete reading.',
    loadDetailsFailed: 'Failed to load reading details.',
    loadMetersFailed: 'Failed to load meter list.',
  },
}

export default en_readings
