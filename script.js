// Function to parse date from dd-mm-yyyy format
function parseDate(dateString) {
    const parts = dateString.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Function to format date as dd-mm-yyyy
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Function to format date for input[type="date"] (yyyy-mm-dd)
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// Function to get date from URL hash
function getDateFromHash() {
    const hash = window.location.hash.substring(1);
    return hash ? parseDate(hash) : null;
}

// Function to set date in URL hash
function setDateInHash(date) {
    window.location.hash = formatDate(date);
}

// Function to count Sundays
function countSundays(futureDate) {
    const resultElement = document.getElementById('result');
    const postitElement = document.getElementById('postit');
    const today = new Date();

    // Check if the input date is valid and in the future
    if (isNaN(futureDate.getTime()) || futureDate <= today) {
        resultElement.textContent = "Por favor, ingrese una fecha futura válida.";
        postitElement.style.display = 'block';
        return;
    }

    let sundayCount = 0;
    let currentDate = new Date(today.getTime());

    // Set currentDate to the next Sunday
    currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()) % 7);

    // Count Sundays
    while (currentDate < futureDate) {
        sundayCount++;
        currentDate.setDate(currentDate.getDate() + 7);
    }

    // Format the result message with the date in dd-mm-yyyy format
    const formattedDate = formatDate(futureDate);
    resultElement.textContent = `Hay ${sundayCount} domingos hasta ${formattedDate}`;
    postitElement.style.display = 'block';

    // Update URL with the selected date
    setDateInHash(futureDate);
}

// Function to handle button click
function handleCountClick() {
    const dateInput = document.getElementById('dateInput');
    const futureDate = new Date(dateInput.value);
    countSundays(futureDate);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('dateInput');
    const countButton = document.getElementById('countButton');
    
    // Hide the post-it note initially
    document.getElementById('postit').style.display = 'none';

    // Set min attribute to today's date
    const today = new Date();
    dateInput.min = formatDateForInput(today);

    // Check for date in URL
    const hashDate = getDateFromHash();
    if (hashDate && hashDate > today) {
        dateInput.value = formatDateForInput(hashDate);
        countSundays(hashDate);
    }

    // Add event listener to the button
    countButton.addEventListener('click', handleCountClick);

    // Add event listener for Enter key on date input
    dateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleCountClick();
        }
    });
});

// Listen for hash changes
window.addEventListener('hashchange', function() {
    const hashDate = getDateFromHash();
    if (hashDate) {
        document.getElementById('dateInput').value = formatDateForInput(hashDate);
        countSundays(hashDate);
    }
});