<?php
header('Content-Type: text/html; charset= utf-8');

if(isset($_POST[_KEY_POST_URL]) && $url = $_POST[_KEY_POST_URL]){
    $fileName = file_downloadFromUrl($url, _ROOT_TMP_ . _SP_ . getFreeNameFile(_ROOT_TMP_, "tmp"));

    if($fileName){
        $pathinfo = pathinfo($fileName);

        if($pathinfo["extension"] == "zip"){
            $zip = new ZipArchive;
            $res = $zip->open($fileName);
            if($res === TRUE){
                $extrDir = $pathinfo["dirname"] . DIRECTORY_SEPARATOR . $pathinfo["filename"];
                $zip->extractTo($extrDir . DIRECTORY_SEPARATOR);
                $zip->close();

                $dirHandle = opendir($extrDir . DIRECTORY_SEPARATOR);
                while(false !== ($file = readdir($dirHandle))){
                    if(is_file($extrDir . DIRECTORY_SEPARATOR . $file)){
                        $file = $extrDir . DIRECTORY_SEPARATOR . $file;

                        $tPathinfo = pathinfo($file);
                        if($tPathinfo["extension"] == "txt"){
                            echo file_get_contents($file);

                            break;
                        };
                    }
                };
                closedir($dirHandle);

                //remove data
                @removeDir($extrDir);
                @unlink($fileName);
            };
        }else if($pathinfo["extension"] == "txt"){
            echo file_get_contents($fileName);
        };
    };
};