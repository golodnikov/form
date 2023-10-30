document.addEventListener("DOMContentLoaded", function () {
    const serviceTypeSelect = document.getElementById("service_type");
    const rateTypeSelect = document.getElementById("rate_type");
    const rentalDurationSelect = document.getElementById("rental_duration");

    function updateAmount() {
        const rateType = rateTypeSelect.value;
        const rentalDuration = rentalDurationSelect.value;

        if (rateType && rentalDuration) {
            fetch('get_amount.php', {
                method: 'POST',
                body: new URLSearchParams({ rate_type: rateType, duration: rentalDuration }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.amount !== undefined) {
                    const amount = parseFloat(data.amount);
                    if (!isNaN(amount)) {
                        document.getElementById("amount").value = amount.toFixed(2) + "р.";
                        enablePaymentButton();
                    } else {
                        console.error('Invalid amount value:', data.amount);
                    }
                } else {
                    console.error('No amount found for the selected rate and duration.');
                }
            })
            .catch(error => {
                console.error('Error loading amount:', error);
            });
        }
    }

    serviceTypeSelect.addEventListener("change", function () {
        const serviceType = serviceTypeSelect.value;
        const allowedRateTypes = {
            "Рабочее место": ["Гость", "Резидент", "Агентство"],
            "Переговорка": ["1 час", "Полдня", "День"],
            "Конференц-зал": ["1час", "2 часа", "3 часа", "4 часа", "5 часов", "6 часов", "7 часов", "8 часов"]
        };
    
        updateRateTypes(allowedRateTypes[serviceType]);
    });
    

    rateTypeSelect.addEventListener("change", function () {
        updateRentalDurations(serviceTypeSelect.value, rateTypeSelect.value);
    });

    rentalDurationSelect.addEventListener("change", updateAmount);

    function updateRateTypes(allowedTypes) {
        rateTypeSelect.innerHTML = '';

        fetch('get_rates.php', {
            method: 'POST',
            body: new URLSearchParams({ service_type: serviceTypeSelect.value }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.rates && data.rates.length > 0) {
                displayRates(data.rates, allowedTypes);
            } else {
                console.error('No rates found for the selected service.');
            }
        })
        .catch(error => {
            console.error('Error loading rates:', error);
        });
    }

    function displayRates(rates, allowedRateTypes) {
        rates.forEach(rate => {
            const rateType = rate.rate_type;

            if (allowedRateTypes.includes(rateType)) {
                const option = document.createElement('option');
                option.text = rateType;
                option.value = rateType;
                rateTypeSelect.add(option);
            }
        });

        updateRentalDurations(serviceTypeSelect.value, rateTypeSelect.value);
    }

    function updateRentalDurations(serviceType, rateType) {
        rentalDurationSelect.innerHTML = '';

        fetch('get_durations.php', {
            method: 'POST',
            body: new URLSearchParams({ service_type: serviceType, rate_type: rateType }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.durations && data.durations.length > 0) {
                data.durations.forEach(duration => {
                    const option = document.createElement('option');
                    option.text = duration;
                    option.value = duration;
                    rentalDurationSelect.add(option);
                });
                updateAmount();
            } else {
                console.error('No durations found for the selected service and rate.');
            }
        })
        .catch(error => {
            console.error('Error loading durations:', error);
        });
    }

    function enablePaymentButton() {
        const paymentButton = document.getElementById("payment-button");
        if (paymentButton) {
            paymentButton.disabled = false;
        }
    }
});

function clearFormFields() {
    document.getElementById("full_name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("activity_type").value = "";
    document.getElementById("service_type").value = "";
    document.getElementById("rate_type").value = "";
    document.getElementById("rental_duration").value = "";
    document.getElementById("amount").value = "";
}

function validateForm() {
    const full_name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const activity_type = document.getElementById("activity_type").value;
    const serviceType = document.getElementById("service_type").value;
    const rateType = document.getElementById("rate_type").value;
    const rentalDuration = document.getElementById("rental_duration").value;

    if (full_name.trim() === "" || email.trim() === "" || phone.trim() === "" || activity_type.trim() === "" || rentalDuration === "") {
        alert("Пожалуйста, заполните все обязательные поля.");
        return false;
    }

    if (!validateEmail(email)) {
        alert("Пожалуйста, введите корректный e-mail.");
        return false;
    }

    if (!validatePhone(phone)) {
        alert("Пожалуйста, введите корректный телефон (10 цифр).");
        return false;
    }

    if ((serviceType === "Рабочее место" || serviceType === "Переговорка") && !rateType) {
        alert("Пожалуйста, выберите тариф.");
        return false;
    }

    if (serviceType === "Конференц-зал" && !/^\d+\sчас(ов)?$/.test(rentalDuration)) {
        alert("Пожалуйста, выберите продолжительность аренды в формате 'N час' или 'N часов'.");
        return false;
    }

    return true;
}


function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\d{10}$/;
    return re.test(phone);
}

function submitPayment() {
    if (!validateForm()) {
        return;
    }

    const form = document.getElementById("payment-form");
    const formData = new FormData(form);

    fetch('process_payment.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Платеж успешно отправлен.");
            clearFormFields();
        } else {
            alert("Ошибка: " + data.error);
        }
    })
    .catch(error => {
        console.error(error);
        alert("Ошибка при отправке платежа.");
    });
}

document.getElementById("rental_duration").addEventListener("change", updateAmount);