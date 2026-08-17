export const serviceRequests = {
  addModal: {
    title: 'Service Request',
    description: 'Enter the details for the service request below.',
    fields: {
      meter: 'Meter',
      customer: 'Customer',
      assignedEngineer: 'Assigned Engineer',
      requestType: 'Request Type',
      priority: 'Priority',
      status: 'Status',
      description: 'Description',
      completedAt: 'Completed At'
    },
    requestTypes: {
      new_connection: 'New Connection',
      maintenance: 'Maintenance',
      disconnection: 'Disconnection'
    },
    priorities: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      emergency: 'Emergency'
    },
    statuses: {
      pending: 'Pending',
      assigned: 'Assigned',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    actions: {
      cancel: 'Cancel',
      add: 'Add Request'
    }
  }
}
