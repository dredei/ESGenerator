<?php
header('Content-Type: text/html; charset= utf-8');

if(isset($_POST[_KEY_POST_JSON]) && $json = $_POST[_KEY_POST_JSON]){
    $zip = (isset($_POST[_KEY_POST_ZIP])) ? true : false;

    $fileName = _ROOT_TMP_ . _SP_ . getFreeNameFile(_ROOT_TMP_, "txt");

    $h = fopen($fileName,"w+");
    fwrite($h, $json);
    fclose($h);

    if($zip){
        $zipName = _ROOT_TMP_ . _SP_ .  getFreeNameFile(_ROOT_TMP_, "zip");

        $zip = new ZipArchive();
        $zip->open($zipName, ZIPARCHIVE::CREATE);
        $zip->addFile($fileName, basename("es.txt"));
        $zip->close();

        @unlink($fileName);
        $fileName = $zipName;
    };

    echo json_encode(array("url" => "ajax.php?route=esDownload&id=".basename($fileName, (($zip) ? ".zip" : ".txt")).(($zip) ? "&zip" : "")."&rnd=".rand()));
};