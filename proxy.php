<?php
if (!ini_get('display_errors')) {
    ini_set('display_errors', '1');
}

$url = @$_REQUEST['url'];
$port = @$_REQUEST['port'];
$accept = @$_REQUEST['accept'];
$cache = @$_REQUEST['cache'];
$cachefail = @$_REQUEST['cachefail'];

$msg = "";

$msg = "cachefail : $cachefail\n";

$data = @$_REQUEST['data'];
$curl_opts = @$_REQUEST['curl_opts'];

$user = "undeed";
$pass = "moronio";

$fromcache = "";
$notfromcache = "";

$got_from_cache = false;
if($cache){
    $result = load_from_cache($url);
    if($result and (!$cachefail or strpos($result, $cachefail) === false  )){
        $got_from_cache = true;
        $fromcache .= "$url \n";
    }
}


if(!$got_from_cache){

    $notfromcache .= "$url \n";

    $ch = new allegroProxy();
    $ch->url = $url;
    $ch->data = $data;
    $ch->accept = $accept;

    $result = $ch->exec();
}


if(!$got_from_cache and $cache and strpos($result, $cachefail) === false){
    save_to_cache($url, $result);

}
file_put_contents("./cache/debug.txt",  $msg);
file_put_contents("./cache/fromcache.txt",  $fromcache, FILE_APPEND);
file_put_contents("./cache/notfromcache.txt", $notfromcache, FILE_APPEND);


if($cache){
}
echo $result;



function load_from_cache($url){
    $hash = md5($url);
    $filepath = "./cache/".substr($hash, 0, 1)."/".substr($hash, 1, 1)."/$hash";
    if(file_exists($filepath)){
        return file_get_contents($filepath);
    }
    return false;
}

function save_to_cache($url,$data){
    $hash = md5($url);
    $filepath = "./cache/".substr($hash, 0, 1)."/".substr($hash, 1, 1)."/$hash";
    if(!is_dir(dirname($filepath))){
        mkdir(dirname($filepath), 0777, true );
    }
    file_put_contents($filepath, $data);
}

class allegroProxy{

	protected $_useragent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1'; 
	public $user = "undeed";
	public $pass = "moronio";
	public $url;
	public $data;
	public $request_type = "GET";
	public $accept;
	
	
	public function exec(){
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_USERPWD, $this->user.':'.$this->pass); 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
		
		if(is_array($this->data) && $this->request_type == "GET"){
			$append = array();
			foreach($this->data as $key=>$value){
				$append[] = $key."=".urlencode($value);
			}
			$this->url .= "?".implode("&", $append);
		}
		if($this->accept != ""){
			curl_setopt($ch,CURLOPT_HTTPHEADER,array (
				"Accept: ".$this->accept
			));
		}
		curl_setopt($ch, CURLOPT_URL, $this->url); 		

		$data = curl_exec($ch); 
		return $data;
	}
	

}


class mycurl { 
     protected $_useragent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1'; 
     protected $_url; 
     protected $_followlocation; 
     protected $_timeout; 
     protected $_maxRedirects; 
     protected $_cookieFileLocation = './cookie.txt'; 
     protected $_post; 
     protected $_postFields; 
     protected $_referer ="http://www.google.com"; 

     protected $_session; 
     protected $_webpage; 
     protected $_includeHeader; 
     protected $_noBody; 
     protected $_status; 
     protected $_binaryTransfer; 
     public    $authentication = 0; 
     public    $auth_name      = ''; 
     public    $auth_pass      = ''; 

     public function useAuth($use){ 
       $this->authentication = 0; 
       if($use == true) $this->authentication = 1; 
     } 

     public function setName($name){ 
       $this->auth_name = $name; 
     } 
     public function setPass($pass){ 
       $this->auth_pass = $pass; 
     } 

     public function __construct($url,$followlocation = true,$timeOut = 30,$maxRedirecs = 4,$binaryTransfer = false,$includeHeader = false,$noBody = false) 
     { 
         $this->_url = $url; 
         $this->_followlocation = $followlocation; 
         $this->_timeout = $timeOut; 
         $this->_maxRedirects = $maxRedirecs; 
         $this->_noBody = $noBody; 
         $this->_includeHeader = $includeHeader; 
         $this->_binaryTransfer = $binaryTransfer; 

         $this->_cookieFileLocation = dirname(__FILE__).'/cookie.txt'; 

     } 

     public function setReferer($referer){ 
       $this->_referer = $referer; 
     } 

     public function setCookiFileLocation($path) 
     { 
         $this->_cookieFileLocation = $path; 
     } 

     public function setPost ($postFields) 
     { 
        $this->_post = true; 
        $this->_postFields = $postFields; 
     } 

     public function setUserAgent($userAgent) 
     { 
         $this->_useragent = $userAgent; 
     } 

     public function createCurl($url = 'nul') 
     { 
        if($url != 'nul'){ 
          $this->_url = $url; 
        } 

         $s = curl_init(); 

         curl_setopt($s,CURLOPT_URL,$this->_url); 
         curl_setopt($s,CURLOPT_HTTPHEADER,array('Expect:')); 
         curl_setopt($s,CURLOPT_TIMEOUT,$this->_timeout); 
         curl_setopt($s,CURLOPT_MAXREDIRS,$this->_maxRedirects); 
         curl_setopt($s,CURLOPT_RETURNTRANSFER,true); 
         curl_setopt($s,CURLOPT_FOLLOWLOCATION,$this->_followlocation); 
         curl_setopt($s,CURLOPT_COOKIEJAR,$this->_cookieFileLocation); 
         curl_setopt($s,CURLOPT_COOKIEFILE,$this->_cookieFileLocation); 

         if($this->authentication == 1){ 
           curl_setopt($s, CURLOPT_USERPWD, $this->auth_name.':'.$this->auth_pass); 
         } 
         if($this->_post) 
         { 
             curl_setopt($s,CURLOPT_POST,true); 
             curl_setopt($s,CURLOPT_POSTFIELDS,$this->_postFields); 

         } 

         if($this->_includeHeader) 
         { 
               curl_setopt($s,CURLOPT_HEADER,true); 
         } 

         if($this->_noBody) 
         { 
             curl_setopt($s,CURLOPT_NOBODY,true); 
         } 
         /* 
         if($this->_binary) 
         { 
             curl_setopt($s,CURLOPT_BINARYTRANSFER,true); 
         } 
         */ 
         curl_setopt($s,CURLOPT_USERAGENT,$this->_useragent); 
         curl_setopt($s,CURLOPT_REFERER,$this->_referer); 

         $this->_webpage = curl_exec($s); 
                   $this->_status = curl_getinfo($s,CURLINFO_HTTP_CODE); 
         curl_close($s); 

     } 

   public function getHttpStatus() 
   { 
       return $this->_status; 
   } 

   public function __tostring(){ 
      return $this->_webpage; 
   } 
} 

?>