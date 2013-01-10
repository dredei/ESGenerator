<?php
header('Content-Type: text/html; charset= utf-8');

$out = "error";

$keyFile = "es";
if($_FILES[$keyFile]["size"] > 1024*1024 * 5){
    $out = "file_max_size";
}else{
    $fileName = _ROOT_TMP_ . _SP_ . $_FILES[$keyFile]["name"];
    move_uploaded_file($_FILES[$keyFile]["tmp_name"], $fileName);

    if(file_exists($fileName)){
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
                            $out = file_get_contents($file);

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
            $out =  file_get_contents($fileName);
        };
    };
};

echo $out;