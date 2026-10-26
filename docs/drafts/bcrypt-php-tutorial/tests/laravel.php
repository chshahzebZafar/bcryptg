<?php
$pw = 'correct horse battery staple';
$b = '$2b$12$RB2qR6GI4quP.PUs6xR5He37dCyunLcYFzlvUfwSX41XkRXgOQ3OS'; // from our generator (bcryptjs)
$y = '$2y$12$' . substr($b, 7);
echo "PHP " . PHP_VERSION . "\n";
foreach (['$2b$' => $b, '$2y$' => $y, '$2a$' => '$2a$12$' . substr($b, 7)] as $k => $h) {
  $info = password_get_info($h);
  echo "$k password_get_info algoName=" . var_export($info['algoName'], true) . " algo=" . var_export($info['algo'], true)
     . " | password_verify=" . var_export(password_verify($pw, $h), true) . "\n";
}
