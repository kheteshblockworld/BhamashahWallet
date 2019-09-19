<?php
       function encryption($arg1){
       $dataString = $arg1;
       // $dataString = '{"SSOID":"SSOTESTKIOSK1","SRVID":"1219","searchKey":"210412029961"}';
       $encryptionKey = "E-m!tr@2016";
       $method = 'aes-128-cbc';
       $key = hash("sha256", $encryptionKey, true);
       $iv = substr($key, 0, 16);
       $encode = base64_encode( openssl_encrypt ($dataString, $method, $key, true, $iv));
       echo $encode;

       $encryptedString = $encode;


       return $encryptedString;
   }

   function decryption($arg1){
       $encode = $arg1;
       // $dataString = '{"SSOID":"SSOTESTKIOSK1","SRVID":"1219","searchKey":"210412029961"}';
       $encryptionKey = "E-m!tr@2016";
       $method = 'aes-128-cbc';
       $key = hash("sha256", $encryptionKey, true);
       $iv = substr($key, 0, 16);
       $encryptedString = $encode;
       $c = base64_decode($encryptedString);
       $decode = openssl_decrypt( $c, $method, $key, true, $iv);
       return $decode;
   }