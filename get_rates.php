<?php
$host = "localhost";
$dbname = "form_db";
$username = "root";
$password = "";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['service_type'])) {
        $serviceType = $_POST['service_type'];

        $query = "SELECT * FROM pricing WHERE service_type = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$serviceType]);

        $rates = $stmt->fetchAll(PDO::FETCH_ASSOC);

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Max-Age: 86400');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
        header('Content-Type: application/json');
        echo json_encode(array('rates' => $rates));
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(array('error' => 'Invalid request.'));
    }
} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(array('error' => $e->getMessage()));
}
?>












