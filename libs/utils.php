<?php
function getESProjectName($json){
    try{
        $es = json_decode($json);
        return (($es->ProjectName && strlen($es->ProjectName) > 0) ? $es->ProjectName : false);
    }catch(Exception $exp){
        return false;
    };
};

function getFreeNameFile($dir, $ext){
    $i = 1;

    while(file_exists($dir . _SP_ . $i.".".$ext)){$i++;};

    return $i.".".$ext;
};

function file_download($file, $fileName = "es.txt", $mimetype='application/octet-stream') {
    if(file_exists($file)){
        header($_SERVER["SERVER_PROTOCOL"] . ' 200 OK');
        header('Content-Type: ' . $mimetype);
        header('Last-Modified: ' . gmdate('r', filemtime($file)));
        header('ETag: ' . sprintf('%x-%x-%x', fileinode($file), filesize($file), filemtime($file)));
        header('Content-Length: ' . (filesize($file)));
        header('Connection: close');
        header('Content-Disposition: attachment; filename="' . basename($fileName) . '";');
        $f=fopen($file, 'r');
        while(!feof($f)){
            echo fread($f, 1024);
            flush();
        };
        fclose($f);
    }else{
        header($_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
        header('Status: 404 Not Found');
    };
};

function removeOldFiles($dir, $countHour){
    $dirHandle = opendir($dir . _SP_);
    while(false !== ($file = readdir($dirHandle))){
        if(is_file($dir._SP_.$file)){
            $file = $dir._SP_.$file;

            if(((time()-filemtime($file)) / (60 * 60)) > $countHour){
                @unlink($file);
            };
        }
    };
    closedir($dirHandle);
};

function file_downloadFromUrl($url, $file){
    $content_type = array(
        "application/zip" => "zip",
        "text/plain" => "txt"
    );
    $dest_file = @fopen($file, "w");

    $resource = curl_init();
    curl_setopt($resource, CURLOPT_URL, $url);
    curl_setopt($resource, CURLOPT_FILE, $dest_file);
    curl_setopt($resource, CURLOPT_AUTOREFERER, TRUE);
    //curl_setopt($resource, CURLOPT_FOLLOWLOCATION , TRUE);
    curl_setopt($resource, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.0.8) Gecko/2009032609 Firefox/3.0.8');
    curl_setopt($resource, CURLOPT_REFERER, 'http://generator.waspace.net/');
    curl_setopt($resource, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($resource, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($resource, CURLOPT_HTTPHEADER, array('Expect:'));
    curl_exec($resource);
    $ret = curl_getinfo($resource);
    if($ret && $ret["content_type"]){
        $c_type = preg_split("/;/", $ret["content_type"]);
        $c_type = $c_type[0];

        if(isset($content_type[$c_type])){
            $ext = $content_type[$c_type];
        }else{
            return false;
        };
    }else if(_getExtension($url) == "txt"){
        $ext = $content_type["text/plain"];
    }else if(_getExtension($url) == "zip"){
        $ext = $content_type["application/zip"];
    }else{
        return false;
    };
    curl_close($resource);
    fclose($dest_file);

    $pathinfo = pathinfo($file);
    $newFileName = $pathinfo["dirname"] . DIRECTORY_SEPARATOR . getFreeNameFile($pathinfo["dirname"], $ext);
    rename($file, $newFileName);

    return $newFileName;
}

function removeDir($path)
{
    if(file_exists($path) && is_dir($path))
    {
        $dirHandle = opendir($path);
        while (false !== ($file = readdir($dirHandle)))
        {
            if ($file!='.' && $file!='..')// исключаем папки с назварием '.' и '..'
            {
                $tmpPath=$path.'/'.$file;
                chmod($tmpPath, 0777);

                if (is_dir($tmpPath))
                {  // если папка
                    removeDir($tmpPath);
                }
                else
                {
                    if(file_exists($tmpPath))
                    {
                        // удаляем файл
                        unlink($tmpPath);
                    }
                }
            }
        }
        closedir($dirHandle);

        // удаляем текущую папку
        if(file_exists($path))
        {
            rmdir($path);
        }
    }
    else
    {
        echo "Удаляемой папки не существует или это файл!";
    }
};

function _getExtension($filename) {
    $path_info = pathinfo($filename);
    return $path_info['extension'];
}