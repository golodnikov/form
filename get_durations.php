<?php
$host = "localhost";
$dbname = "form_db";
$username = "root";
$password = "";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['rate_type'])) {
        $rateType = $_POST['rate_type'];

        $query = "SELECT DISTINCT duration FROM pricing WHERE rate_type = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$rateType]);

        $durations = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $durations[] = $row['duration'];
        }

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Max-Age: 86400');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
        header('Content-Type: application/json');
        echo json_encode(array('durations' => $durations));
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(array('error' => 'Invalid request.'));
    }
} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(array('error' => $e->getMessage()));
}
?>
