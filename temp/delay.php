<?php 
$time = 1;
$message = "Add ?time=2 to the URL to see a two second delay.  Increase the number for longer delays.";
if( isset($_GET['time']) && $_GET['time'] > 0) {
	//$jsonArray = json_decode($_POST['obj']);
	$time = (int)trim(strip_tags($_GET['time']));
	$message = "var message=\"" . $time . " second delay\"";
}
sleep($time);
echo($message);

?>