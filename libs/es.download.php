<?php
$name = $_GET[_KEY_GET_ID];
$ext = (isset($_GET[_KEY_GET_ZIP]) ? "zip" : "txt");
file_download(_ROOT_TMP_ . _SP_ . $name.".".$ext, "es.".$ext);