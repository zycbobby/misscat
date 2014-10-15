<?php
session_start();
@include 'vars.php';

class Blog {
	public $text_id;
	public $text_content;
	public $text_type;
	public $media_type;
	public $post_time;
}


try {

    $link = mysql_connect(SAE_MYSQL_HOST_M . ':' . SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS);
    if ($link) {
        mysql_select_db(SAE_MYSQL_DB, $link) or die("Could not select database");
    }

    $query = "select bt.text_id, bt.text_content, bt.text_type,bt.media_type, bt.post_time from blog_text as bt order by bt.post_time desc";
    mysql_query("SET NAMES 'UTF8'", $link) or die("Could not set names");
    $result = mysql_query($query) or die("Query failed");

    $blogs = array();

    while ($line = mysql_fetch_array($result, MYSQL_BOTH)) {
		$obj = new Blog;
        $obj->text_id = $line[0];
        $obj->text_content = $line[1];
        $obj->text_type = $line[2];
        $obj->media_type = $line[3];
        $date = date_create($line[4]);
        $obj->post_time = $date -> format('Y-m-d D');
        array_push($blogs, $obj);
        // print $obj;
        // print $obj->text_id;
    }

    print json_encode($blogs);

    mysql_free_result($result);

    mysql_close($link);

} catch (Exception $e) {
    print $e->getMessage();
}


?>

