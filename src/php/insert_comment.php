<?php
#insert something into database
#
#if you debug this page in local, please uncomment the next line
@include 'vars.php';

function safeEncoding($string,$outEncoding ='UTF-8')
{
	$encoding = "UTF-8";
	for($i=0;$i<strlen($string);$i++)
	{
		if(ord($string{$i})<128)
		continue;
		if((ord($string{$i})&224)==224)
		{
			//第一个字节判断通过
			$char = $string{++$i};
		if((ord($char)&128)==128)
		{
		//第二个字节判断通过
		$char = $string{++$i};
			if((ord($char)&128)==128)
			{
				$encoding = "UTF-8";
				break;
			}
		}
	}
	if((ord($string{$i})&192)==192)
	{
		//第一个字节判断通过
		$char = $string{++$i};
		if((ord($char)&128)==128)
		{
			// 第二个字节判断通过
			$encoding = "GBK";
			break;
		}
	}
}
if(strtoupper($encoding) == strtoupper($outEncoding))
	return $string;
else
	return iconv($encoding,$outEncoding,$string);
}



$con= mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS) or die("1 Could not connect");

mysql_query("SET NAMES 'UTF8'",$con) or die("Could not set names");

mysql_select_db(SAE_MYSQL_DB, $con);

$json = file_get_contents('php://input');
$obj = json_decode($json);

// echo 'abc';
// echo $obj->comment_content;
// echo $obj->text_id;

$content = safeEncoding($obj->comment_content,'UTF-8');
$text_id=$obj->text_id;
//
//
// if (TRUE==is_utf8($content));
// {
// //	$uname	= mb_convert_encoding($uname, 'utf-8');
//
// }
$sql="INSERT INTO ".SAE_MYSQL_DB.".blog_comment(comment_id,text_id,comment_text,comment_time)
VALUES (NULL, '$text_id' ,'$content', CURRENT_TIMESTAMP);";


echo $sql;

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }

//echo "1 record added";
mysql_close($con)

?>
