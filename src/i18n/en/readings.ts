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
    searchPlaceholder: 'Search readings...',
    filters: {
      status: {
        all: 'All Statuses',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      method: {
        all: 'All Methods',
        manual: 'Manual',
        qrScan: 'QR Scan',
      },
      date: {
        all: 'All Dates',
        today: 'Today',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
      },
    },
    actions: {
      addReading: 'Add Reading',
      export: 'Export',
      refresh: 'Refresh',
    },
  },
  table: {
    columns: {
      readingId: 'Reading ID',
      meterNumber: 'Meter',
      previousReading: 'Previous',
      currentReading: 'Current',
      consumption: 'Consumption',
      pricePerKwh: 'Price/kWh',
      readingCost: 'Cost',
      readingDate: 'Reading Date',
      method: 'Method',
      status: 'Status',
      actions: 'Actions',
    },
    emptyState: {
      title: 'No readings found',
      description: 'Adjust your search filters or add a new reading.',
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
    notes: 'Notes',
    createdBy: 'Created By',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
  },
  addModal: {
    title: 'Add Meter Reading',
    description: 'Enter the new reading details. Consumption and cost will be calculated automatically.',
    meterSelect: 'Select Meter',
    preview: {
      consumption: 'Est. Consumption',
      cost: 'Est. Cost',
    },
    actions: {
      cancel: 'Cancel',
      add: 'Add Reading',
    },
    validation: {
      currentLessThanPrevious: 'Current reading cannot be less than previous reading.',
    }
  },
  actions: {
    viewDetails: 'View Details',
    edit: 'Edit Reading',
    delete: 'Delete Reading',
    approve: 'Approve',
    reject: 'Reject',
  },
  notifications: {
    added: 'Meter reading added successfully.',
    deleted: 'Meter reading deleted successfully.',
    statusUpdated: 'Reading status updated successfully.',
  }
}

export default en_readings
