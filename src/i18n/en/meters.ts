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
    meterNumber: 'Meter Number',
    qrCode: 'QR Code',
    installationDate: 'Installation Date',
    installationLocation: 'Installation Location',
    status: 'Status',
    installedBy: 'Installed By'
  },
  status: {
    active: 'Active',
    disconnected: 'Disconnected',
    maintenance: 'Maintenance',
    damaged: 'Damaged'
  },
  emptyState: {
    title: 'No meters registered yet',
    description: 'Please add new meters or adjust search filters to show desired results in this table.'
  },
  pagination: {
    showing: 'Showing {{count}} of {{total}} meters'
  },
  modal: {
    addTitle: 'Add New Meter',
    subtitle: 'Enter the meter information and installation details.',
    sectionMeter: 'Meter Information',
    sectionInstallation: 'Installation Information',
    sectionStatus: 'Meter Status',
    meterNumber: 'Meter Number',
    qrCode: 'QR Code',
    searchCustomer: 'Customer',
    searchCustomerPlaceholder: 'Search for customer...',
    installationDate: 'Installation Date',
    installationLocation: 'Installation Location',
    installedBy: 'Installed By',
    installedByPlaceholder: 'Search for employee...',
    status: 'Meter Status',
    cancel: 'Cancel',
    confirmAdd: 'Save Meter'
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
    viewInvoices: 'View Invoices'
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
