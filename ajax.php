<?php
error_reporting(E_ALL);

include "constants.php";
include _ROOT_LIB_ . _SP_ . "utils.php";

removeOldFiles(_ROOT_TMP_, 1);

$routing = array(
    "esGenerate" => "es.generate.php",
    "esDownload" => "es.download.php",
    "esDownloadFromUrl" => "es.downloadfromurl.php",
    "esDownloadFromPC" => "es.downloadfrompc.php"
);


if(isset($_GET[_KEY_GET_ROUTE]) && isset($routing[$_GET[_KEY_GET_ROUTE]]) && $file = $routing[$_GET[_KEY_GET_ROUTE]]){
    include _ROOT_LIB_ . _SP_ . $file;
};