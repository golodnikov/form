<?php
$host = "localhost";
$dbname = "form_db";
$username = "root";
$password = "";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['rate_type']) && isset($_POST['duration'])) {
        $rateType = $_POST['rate_type'];
        $duration = $_POST['duration'];

        $query = "SELECT amount FROM pricing WHERE rate_type = ? AND duration = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$rateType, $duration]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Max-Age: 86400');
            header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
            header('Content-Type: application/json');
            echo json_encode(array('amount' => $row['amount']));
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(array('error' => 'Rate not found for the selected duration.'));
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(array('error' => 'Invalid request.'));
    }
} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(array('error' => $e->getMessage()));
}
?>


