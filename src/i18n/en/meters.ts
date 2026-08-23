export default {
  title: 'Meter Management',

  breadcrumb: {
    home: 'Home',
    meters: 'Meter Management'
  },

  stats: {
    total: {
      label: 'Total Meters',
      subtext: 'All registered meters'
    },
    active: {
      label: 'Active Meters',
      subtext: 'Currently operating'
    },
    disconnected: {
      label: 'Disconnected Meters',
      subtext: 'Service stopped'
    },
    maintenance: {
      label: 'Meters Under Maintenance',
      subtext: 'Scheduled or emergency maintenance'
    },
    damaged: {
      label: 'Damaged Meters',
      subtext: 'Needs replacement'
    }
  },

  toolbar: {
    searchPlaceholder: 'Search by meter number or QR code...',
    status: 'Status',
    addMeter: 'Add Meter',
    refresh: 'Refresh'
  },

  table: {
    id: '#',
    meterNumber: 'Meter Number',
    customer: 'Customer',
    qrCode: 'QR Code',
    installationDate: 'Installation Date',
    installationLocation: 'Installation Location',
    status: 'Status',
    installedBy: 'Installed By',
    createdBy: 'Created By',
    createdAt: 'Created At',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete'
  },

  status: {
    active: 'Active',
    disconnected: 'Disconnected',
    maintenance: 'Maintenance',
    damaged: 'Damaged'
  },

  emptyState: {
    title: 'No meters registered yet',
    description:
      'Please add new meters or adjust search filters to show desired results in this table.'
  },

  loading: 'Loading...',

  errors: {
    loadFailed:
      'Failed to load meters. Make sure the backend server is running.',
    statsFailed: 'Failed to load meter statistics.',
    deleteFailed: 'Failed to delete meter.',
    saveFailed: 'Failed to save meter.',
    loadDetailsFailed: 'Failed to load meter details.'
  },

  deleteConfirm: 'Are you sure you want to delete this meter?',

  pagination: {
    showing: 'Showing {{count}} of {{total}} meters'
  },

  modal: {
    addTitle: 'Add New Meter',
    editTitle: 'Edit Meter',
    subtitle: 'Enter the meter information and installation details.',
    sectionMeter: 'Meter Information',
    sectionInstallation: 'Installation Information',
    sectionStatus: 'Meter Status',
    meterNumber: 'Meter Number',
    qrCode: 'QR Code',

    searchCustomer: 'Customer',
    searchCustomerPlaceholder: 'Search for customer...',
    selectCustomerPlaceholder: 'Select a customer...',

    installationDate: 'Installation Date',
    installationLocation: 'Installation Location',

    installedBy: 'Installed By',
    installedByPlaceholder: 'Search for employee...',
    selectInstalledByPlaceholder:
      'Select the responsible technician...',

    status: 'Meter Status',

    cancel: 'Cancel',
    confirmAdd: 'Save Meter',
    confirmEdit: 'Update Meter',
    saving: 'Saving...'
  },

  drawer: {
    title: 'Meter Details',
    close: 'Close',
    smartMeter: 'Smart Meter Number',
    customerInfo: 'Customer Data',
    fullName: 'Full Name',
    subscriptionNo: 'Subscription No.',
    address: 'Address',
    analytics: 'Consumption Analytics (Last 6 Months)',
    noData: 'No Data',
    recentRequests: 'Recent Service Requests',
    noRequests: 'No Requests',
    printReport: 'Print Report',
    viewInvoices: 'View Invoices',
    createdAt: 'Created At',
    qrImage: 'QR Code Image'
  },

  months: {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun'
  },

  requests: {
    periodicInspection: 'Periodic Meter Inspection',
    replacePanel: 'Replace Control Panel',
    maintenance: 'Periodic Maintenance',
    connectionLoss: 'Network Connection Loss'
  }
}
