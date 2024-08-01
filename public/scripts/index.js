function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('signupForm')) {
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            //e.preventDefault(); temporary ga comment chesa
            //alert('Signed up successfully!');
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
           // e.preventDefault();
           
            //alert('Logged in successfully!');
        });

        document.getElementById('user-type').addEventListener('change', (e) => {
            const proFields = document.querySelectorAll('.pro-field');
            if (e.target.value === 'professional') {
                proFields.forEach(field => field.style.display = 'block');
            } else {
                proFields.forEach(field => field.style.display = 'none');
            }
        });
    }
});

const search = document.querySelector(".search-container input"),
  serviceSections = document.querySelectorAll(
    ".content-section .homeCleaning .home-clean"
  );

search.addEventListener("input", searchServices);

function searchServices() {
  let searchValue = search.value.toLowerCase();
  serviceSections.forEach((service) => {
    let serviceData = service.textContent.toLowerCase();
    service.classList.toggle("hide", !serviceData.includes(searchValue));
  });
}