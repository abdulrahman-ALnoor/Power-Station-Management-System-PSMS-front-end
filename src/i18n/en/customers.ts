export const customers = {
  addModal: {
    title: 'Add Customer',
    description: 'Enter the details for the new customer below.',
    fields: {
      customerNumber: 'Customer Number',
      fullName: 'Full Name',
      customerType: 'Customer Type',
      phone: 'Phone Number',
      alternativePhone: 'Alternative Phone',
      address: 'Address',
      notes: 'Notes'
    },
    types: {
      residential: 'Residential',
      commercial: 'Commercial',
      industrial: 'Industrial'
    },
    actions: {
      cancel: 'Cancel',
      add: 'Add Customer'
    }
  }
}
