<?php
session_start();
@include 'vars.php';

class Comment {
    public $text_id;
	public $text_content;
	public $post_time;
    public $reply_to;
}


try {

    $link = mysql_connect(SAE_MYSQL_HOST_M . ':' . SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS);
    if ($link) {
        mysql_select_db(SAE_MYSQL_DB, $link) or die("Could not select database");
    }

    $query = "select bc.comment_id, bc.text_id, bc.comment_text, bc.comment_time from blog_comment as bc order by bc.comment_time";
    mysql_query("SET NAMES 'UTF8'", $link) or die("Could not set names");
    $result = mysql_query($query) or die("Query failed");

    $blogs = array();

    while ($line = mysql_fetch_array($result, MYSQL_BOTH)) {
		$obj = new Comment;
        $obj->text_id = $line[0];
        $obj->reply_to = $line[1];
        $obj->text_content = $line[2];
        $date = date_create($line[3]);
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

