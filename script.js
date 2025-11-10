// Language Management
let currentLanguage = 'en';

// Check if language was previously selected
document.addEventListener('DOMContentLoaded', function() {
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
    document.getElementById('languageModal').classList.add('hidden');
    updateLanguage();
  } else {
    // Show language modal on first visit
    document.getElementById('languageModal').classList.remove('hidden');
    // Set default placeholders in English
    updateLanguage();
  }
});

function selectLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('selectedLanguage', lang);
  document.getElementById('languageModal').classList.add('hidden');
  updateLanguage();
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
  localStorage.setItem('selectedLanguage', currentLanguage);
  updateLanguage();
}

function updateLanguage() {
  // Update all elements with data attributes
  const elements = document.querySelectorAll('[data-en][data-es]');
  elements.forEach(element => {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      // Handle placeholders for input elements
      if (element.hasAttribute('data-placeholder-en') && element.hasAttribute('data-placeholder-es')) {
        element.placeholder = currentLanguage === 'en' ? 
          element.getAttribute('data-placeholder-en') : 
          element.getAttribute('data-placeholder-es');
      }
    } else {
      // Handle text content for other elements
      element.textContent = currentLanguage === 'en' ? 
        element.getAttribute('data-en') : 
        element.getAttribute('data-es');
    }
  });

  // Update select options
  const selectOptions = document.querySelectorAll('option[data-en][data-es]');
  selectOptions.forEach(option => {
    option.textContent = currentLanguage === 'en' ? 
      option.getAttribute('data-en') : 
      option.getAttribute('data-es');
  });

  // Update language toggle button
  const languageToggle = document.getElementById('currentLanguage');
  if (languageToggle) {
    languageToggle.textContent = currentLanguage === 'en' ? 
      languageToggle.getAttribute('data-en') : 
      languageToggle.getAttribute('data-es');
  }
  
  // Update page direction if needed
  document.documentElement.lang = currentLanguage;
  if (currentLanguage === 'es') {
    document.documentElement.dir = 'ltr'; // Spanish is left-to-right
  }
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
});

// Form Submission Handling
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('qualificationForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      // Don't prevent default - allow form to submit to Google Forms
      
      // Get form data
      const formData = new FormData(form);
      const data = {
        parentFirstName: formData.get('parentFirstName'),
        parentLastName: formData.get('parentLastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        childAge: formData.get('childAge')
      };
      
      // Debug logging
      console.log('Form data:', data);
      
      // Validate form
      if (!data.parentFirstName || !data.parentLastName || !data.email || !data.phone || !data.childAge) {
        console.log('Validation failed:', {
          parentFirstName: data.parentFirstName,
          parentLastName: data.parentLastName,
          email: data.email,
          phone: data.phone,
          childAge: data.childAge
        });
        e.preventDefault();
        const errorMsg = currentLanguage === 'en' 
          ? 'Please fill in all required fields.' 
          : 'Por favor complete todos los campos requeridos.';
        alert(errorMsg);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        e.preventDefault();
        const errorMsg = currentLanguage === 'en' 
          ? 'Please enter a valid email address.' 
          : 'Por favor ingrese una dirección de correo electrónico válida.';
        alert(errorMsg);
        return;
      }
      
      // Validate phone format (basic)
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(data.phone)) {
        e.preventDefault();
        const errorMsg = currentLanguage === 'en' 
          ? 'Please enter a valid phone number.' 
          : 'Por favor ingrese un número de teléfono válido.';
        alert(errorMsg);
        return;
      }
      
      // Prevent default form submission (we'll handle it manually)
      e.preventDefault();

      // Show loading state
      const submitButton = form.querySelector('.cta-button');
      const originalText = submitButton.innerHTML;
      const loadingText = currentLanguage === 'en' 
        ? '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>' 
        : '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
      submitButton.innerHTML = loadingText;
      submitButton.disabled = true;
      
      // Auto-submit to Google Forms
      submitToGoogleForms(data, originalText, submitButton);
      
      // Show follow-up notification after a short delay
      setTimeout(() => {
        showFollowUpNotification();
      }, 1000);
    });
  }
});

// Debug function to find correct field names
function debugGoogleFormFields() {
  // Open the Google Form in a new tab to inspect field names
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdzW6diMdoLSDFOw3NoIUCNgEIIu7VaRaKRs2HZ6uqqKgxV8A/viewform';
  window.open(formUrl, '_blank');
  
  console.log('Please inspect the Google Form fields and find the entry names:');
  console.log('1. Right-click on each field');
  console.log('2. Select "Inspect Element"');
  console.log('3. Look for name="entry.XXXXXXXXX"');
  console.log('4. Provide the field names to update the mapping');
}

// Test function to manually submit form data
function testFormSubmission() {
  const testData = {
    parentFirstName: 'Test',
    parentLastName: 'Parent',
    email: 'test@example.com',
    phone: '555-123-4567',
    childAge: '14'
  };
  
  console.log('Testing form submission with:', testData);
  submitToGoogleForms(testData, 'Test Button', document.querySelector('.cta-button'));
}

// Auto-submit to Google Forms
function submitToGoogleForms(data, originalText, submitButton) {
  const formId = '1FAIpQLSdzW6diMdoLSDFOw3NoIUCNgEIIu7VaRaKRs2HZ6uqqKgxV8A';
  const formAction = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  
  // Create a hidden form for submission
  const hiddenForm = document.createElement('form');
  hiddenForm.action = formAction;
  hiddenForm.method = 'POST';
  hiddenForm.target = 'hidden_iframe';
  hiddenForm.style.display = 'none';
  
  // Create hidden iframe for silent submission
  let iframe = document.getElementById('hidden_iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'hidden_iframe';
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  
  // Map our form fields to Google Form field names
  // Correct field names from the actual Google Form URL
  const fieldMappings = {
    'entry.1592551150': data.parentFirstName, // Parent First Name
    'entry.2023372959': data.parentLastName,  // Parent Last Name
    'entry.2328612': data.email,              // Email
    'entry.580690581': data.phone,            // Phone
    'entry.205939784': `${data.childAge} years old` // Child Age
  };
  
  // Log the data being sent for debugging
  console.log('=== FORM SUBMISSION DEBUG ===');
  console.log('Raw form data:', data);
  console.log('Field mappings:', fieldMappings);
  console.log('Google Form URL:', formAction);
  console.log('Form ID:', formId);
  
  // Create hidden inputs for each field
  Object.keys(fieldMappings).forEach(fieldName => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = fieldName;
    input.value = fieldMappings[fieldName] || '';
    hiddenForm.appendChild(input);
  });
  
  // Add form to page and submit
  document.body.appendChild(hiddenForm);
  console.log('Submitting hidden form to Google Forms...');
  hiddenForm.submit();
  console.log('Form submission completed');
  
  // Clean up
  setTimeout(() => {
    if (document.body.contains(hiddenForm)) {
      document.body.removeChild(hiddenForm);
    }
  }, 1000);
  
  // Reset the original form
  document.getElementById('qualificationForm').reset();
  
  // Show success message on button
  const successMsg = currentLanguage === 'en'
    ? '<i class="fas fa-check-circle"></i> <span>Thanks for submission! The team will contact you soon.</span>'
    : '<i class="fas fa-check-circle"></i> <span>¡Gracias por su envío! El equipo se pondrá en contacto pronto.</span>';
  submitButton.innerHTML = successMsg;
  submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  submitButton.disabled = true;
  
  // Keep the success state for 5 seconds, then reset
  setTimeout(() => {
    submitButton.innerHTML = originalText;
    submitButton.style.background = '';
    submitButton.disabled = false;
  }, 5000);
}

// Follow-up notification function
function showFollowUpNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'follow-up-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">
        <i class="fas fa-phone"></i>
      </div>
      <div class="notification-text">
        <h4 data-en="Thank You for Your Submission!" data-es="¡Gracias por su Envío!">Thank You for Your Submission!</h4>
        <p data-en="Your form has been successfully submitted. Our team will contact you soon to discuss your child's eligibility for the study." data-es="Su formulario ha sido enviado exitosamente. Nuestro equipo se pondrá en contacto con usted pronto para discutir la elegibilidad de su hijo para el estudio.">Your form has been successfully submitted. Our team will contact you soon to discuss your child's eligibility for the study.</p>
      </div>
      <button class="notification-close" onclick="closeFollowUpNotification()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Auto-hide after 15 seconds
  setTimeout(() => {
    closeFollowUpNotification();
  }, 15000);
}

function closeFollowUpNotification() {
  const notification = document.querySelector('.follow-up-notification');
  if (notification) {
    notification.classList.add('hide');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Smooth scrolling for sticky button
document.addEventListener('DOMContentLoaded', function() {
  const stickyButton = document.querySelector('.sticky-button');
  
  if (stickyButton) {
    stickyButton.addEventListener('click', function() {
      const form = document.getElementById('qualificationForm');
      if (form) {
        form.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }
});

// Add scroll effect to sticky button
window.addEventListener('scroll', function() {
  const stickyButton = document.querySelector('.sticky-button');
  const hero = document.querySelector('.hero');
  
  if (stickyButton && hero) {
    const heroHeight = hero.offsetHeight;
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > heroHeight * 0.5) {
      stickyButton.style.opacity = '1';
      stickyButton.style.visibility = 'visible';
    } else {
      stickyButton.style.opacity = '0';
      stickyButton.style.visibility = 'hidden';
    }
  }
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.included-card, .eligibility-content > *, .faq-item, .contact-content > *');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
      }
      
      e.target.value = value;
    });
  }
});

// Add focus effects to form inputs
document.addEventListener('DOMContentLoaded', function() {
  const formInputs = document.querySelectorAll('.form-group input, .form-group select');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
  });
});
