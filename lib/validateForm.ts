// validateForm.ts

export const validateForm = (fields: any): boolean => {
    // Add your validation logic here
    // For example, check if required fields are present and not empty
    if (!fields || typeof fields !== 'object') {
      return false;
    }
  
    // Example validation: checking for required field 'name'
    if (!fields.name || fields.name.trim() === '') {
      return false;
    }
  
    // Add more validation as needed
    return true;
  };
  