const en_settings = {
  pageTitle: 'Company Profile',
  pageSubtitle: 'Manage company information, billing settings, and reading configuration.',
  breadcrumb: {
    home: 'Home',
    settings: 'Company Profile',
  },
  sections: {
    companyInfo: 'Company Information',
    contactInfo: 'Contact Information',
    billingSettings: 'Billing & Reading Settings',
  },
  fields: {
    companyName: 'Company Name',
    companyLogo: 'Company Logo',
    address: 'Company Address',
    whatsappNumber: 'WhatsApp Number',
    supportNumber: 'Support Number',
    currency: 'Currency',
    pricePerKwh: 'Price per kWh',
    readingCycleDays: 'Reading Cycle',
  },
  placeholders: {
    companyName: 'Enter company name',
    address: 'Enter company address',
    whatsappNumber: 'e.g., 967700000000',
    supportNumber: 'e.g., 967711111111',
    currency: 'e.g., USD or YER',
    pricePerKwh: '0.00',
    readingCycleDays: '15',
  },
  logo: {
    upload: 'Upload new logo',
    replace: 'Replace logo',
    remove: 'Remove logo',
    emptyState: 'No logo uploaded',
    supportedFormats: 'Supported formats: PNG, JPG (Max 2MB)',
  },
  actions: {
    save: 'Save Changes',
    cancel: 'Cancel',
  },
  notifications: {
    saveSuccess: 'Company profile updated successfully.',
    saveError: 'Failed to update company profile.',
    logoRemoved: 'Company logo removed.',
  }
}

export default en_settings
