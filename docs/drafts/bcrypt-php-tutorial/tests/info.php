<?php
$hash = '$2y$12$ISHee6aytH3uxUNZgjFAj.m6J4/CcIb/N77F0NJ/Nr.WCVU/SqWU6';
$info = password_get_info($hash);
var_dump($info['algoName'] === 'bcrypt', $info['options']['cost'] === 12);
