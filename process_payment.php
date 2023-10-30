<?php
$host = "localhost";
$dbname = "form_db";
$username = "root";
$password = "";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['service_type'])) {
        $full_name = $_POST['full_name'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        $activity_type = $_POST['activity_type'];
        $service_type = $_POST['service_type'];
        $rate_type = isset($_POST['rate_type']) ? $_POST['rate_type'] : null;
        $rental_duration = $_POST['rental_duration'];

        $amount = str_replace(['р.', ' '], '', $_POST['amount']);

        if (empty($full_name) || empty($email) || empty($phone) || empty($activity_type) || empty($service_type) || empty($rental_duration)) {
            $response = array('success' => false, 'error' => 'Не все обязательные поля заполнены.');
            echo json_encode($response);
            exit;
        }

        // Измененный SQL-запрос для получения уникальных тарифов
        $query = "INSERT INTO payments (full_name, email, phone, activity_type, service_type, rate_type, rental_duration, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$full_name, $email, $phone, $activity_type, $service_type, $rate_type, $rental_duration, $amount]);

        $response = array('success' => true);
        echo json_encode($response);
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(array('error' => 'Invalid request.'));
    }
} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(array('error' => $e->getMessage()));
}
?>







