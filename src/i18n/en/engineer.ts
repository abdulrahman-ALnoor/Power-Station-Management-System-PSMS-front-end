// English — Engineer Dashboard translations
export const engineer = {
  dashboard: {
    title: 'Engineer Dashboard',
    stats: {
      totalRequests: 'Total Requests',
      completedRequests: 'Completed',
      pendingRequests: 'Pending',
      overdueRequests: 'Overdue',
      cancelledRequests: 'Cancelled',
      readyEquipment: 'Ready Equipment',
    },
    charts: {
      requestStatus: 'Request Status',
      performance: 'Engineer Performance',
      completed: 'Completed',
      assigned: 'Assigned',
    },
    recentRequests: {
      title: 'Recent Service Requests',
      columns: {
        requestNumber: 'Request #',
        requestType: 'Type',
        customer: 'Customer',
        meterNumber: 'Meter #',
        priority: 'Priority',
        status: 'Status',
        date: 'Date',
      },
    },
    recentActivities: {
      title: 'Recent Activities',
    },
    equipmentSummary: {
      title: 'Equipment Summary',
      total: 'Total',
      available: 'Available',
      maintenance: 'In Maintenance',
      damaged: 'Damaged',
    },
    quickActions: {
      title: 'Quick Actions',
      addRequest: 'Add Service Request',
      requestEquipment: 'Request Equipment',
      writeReport: 'Write Report',
    },
  },
  serviceRequests: {
    title: 'Service Requests',
    breadcrumb: 'Home / Service Requests',
    createRequest: 'Create Service Request',
    searchPlaceholder: 'Search by ID, customer, or meter...',
    emptyState: 'No service requests found',
    errorState: 'Unable to load service requests',
    stats: {
      total: 'Total Requests',
      pending: 'Pending',
      assigned: 'Assigned',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    table: {
      requestNumber: 'Request #',
      customer: 'Customer',
      meter: 'Meter #',
      type: 'Request Type',
      priority: 'Priority',
      status: 'Status',
      assignedTo: 'Assigned To',
      date: 'Date',
      actions: 'Actions',
    },
    status: {
      pending: 'Pending',
      assigned: 'Assigned',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      emergency: 'Emergency',
    },
    type: {
      new_connection: 'New Connection',
      maintenance: 'Maintenance',
      disconnection: 'Disconnection',
    },
    filters: {
      searchPlaceholder: 'Search by request ID, customer, or meter...',
      status: 'Status',
      type: 'Request Type',
      priority: 'Priority',
      assignedTo: 'Assigned Engineer',
      clearFilters: 'Clear Filters',
      statusOptions: {
        all: 'All Statuses'
      },
      typeOptions: {
        all: 'All Types'
      },
      priorityOptions: {
        all: 'All Priorities'
      },
      engineerOptions: {
        all: 'All Engineers',
        me: 'My Requests',
        unassigned: 'Unassigned'
      }
    },
    createModal: {
      title: 'Add Service Request',
      subtitle: 'Enter service request details',
      sections: {
        customerData: 'Customer Data',
        requestDetails: 'Request Details'
      },
      fields: {
        customer: 'Customer',
        meter: 'Meter',
        requestType: 'Request Type',
        priority: 'Priority',
        description: 'Description'
      },
      placeholders: {
        selectCustomer: 'Select a customer...',
        selectMeter: 'Select a meter...',
        selectCustomerFirst: 'Please select a customer first',
        noMetersFound: 'No meters linked to this customer',
        selectType: 'Select request type...',
        selectPriority: 'Select priority...',
        description: 'Write a detailed description of the service request...'
      },
      actions: {
        cancel: 'Cancel',
        submit: 'Create Service Request'
      },
      errors: {
        requiredFields: 'Please fill out all required fields',
        submissionFailed: 'An error occurred while creating the request'
      }
    },
    actions: {
      viewDetails: 'View Details',
      startExecution: 'Start Execution',
      completeRequest: 'Complete Request',
    },
    details: {
      title: 'Request Details',
      description: 'Description',
      createdAt: 'Created At',
      completedAt: 'Completed At',
      notCompleted: 'Not completed yet',
      statusChange: {
        title: 'Update Status',
        currentStatus: 'Current Status',
        newStatus: 'New Status',
        selectNewStatus: 'Select Status...',
        saveStatus: 'Save Status',
        updating: 'Updating Status...',
        success: 'Request status updated successfully',
        error: 'Unable to update request status, please try again',
        unauthorized: 'You do not have permission to change the status of this request',
        cancelConfirmation: 'Are you sure you want to cancel this service request?',
        cancelConfirmButton: 'Confirm Cancellation',
        cancelCancelButton: 'Cancel',
        assignToMe: 'Assign to me'
      }
    },
  },
  equipment: {
    title: 'Equipment Management',
    breadcrumb: 'Home / Equipment',
    description: 'View and track assigned and available equipment and their current status.',
    createEquipment: 'Add Equipment',
    searchPlaceholder: 'Search by equipment name or serial number...',
    emptyState: 'No results found',
    emptyStateDesc: 'No equipment matching the current search was found.',
    errorState: 'Unable to load equipment',
    retry: 'Retry',
    stats: {
      total: 'Total Equipment',
      available: 'Available',
      maintenance: 'In Maintenance',
      damaged: 'Damaged',
      lost: 'Lost',
    },
    table: {
      name: 'Equipment Name',
      serialNumber: 'Serial Number',
      status: 'Status',
      assignedUser: 'Assigned To',
      notes: 'Notes',
      createdAt: 'Added Date',
    },
    status: {
      available: 'Available',
      maintenance: 'In Maintenance',
      damaged: 'Damaged',
      lost: 'Lost',
    },
    filters: {
      status: 'Equipment Status',
      statusOptions: {
        all: 'All Statuses',
      },
    },
    details: {
      title: 'Equipment Details',
      createdBy: 'Added By',
      unassigned: 'Unassigned',
      noNotes: 'No notes provided',
      notSpecified: 'Not specified',
      statusChange: {
        title: 'Change Status',
        currentStatus: 'Current Status',
        newStatus: 'Select Status',
        saveStatus: 'Save Status',
        updating: 'Updating...',
      }
    },
    createModal: {
      title: 'Add Equipment',
      subtitle: 'Enter details for the new equipment',
      fields: {
        name: 'Equipment Name',
        serialNumber: 'Serial Number',
        status: 'Status',
        assignTo: 'Assign To',
        notes: 'Notes',
      },
      placeholders: {
        name: 'e.g. Emergency Generator 500KW',
        serialNumber: 'e.g. SN-9921',
        selectStatus: 'Select status...',
        selectUser: 'Select user...',
        unassigned: 'Unassigned',
        notes: 'Add notes about the equipment...',
      },
      actions: {
        cancel: 'Cancel',
        submit: 'Add',
      },
      errors: {
        requiredFields: 'Please fill all required fields',
        duplicateSerial: 'Serial number is already in use.',
        submissionFailed: 'An error occurred while adding the equipment',
      },
    },
  },
}
