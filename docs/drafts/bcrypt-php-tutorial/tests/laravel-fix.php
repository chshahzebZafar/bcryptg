<?php
$pw = 'correct horse battery staple';
$body = substr('$2b$12$RB2qR6GI4quP.PUs6xR5He37dCyunLcYFzlvUfwSX41XkRXgOQ3OS', 4);
foreach (['$2b$', '$2a$', '$2y$'] as $p) {
  $hash = $p . $body;
  // --- article code ---
  if (str_starts_with($hash, '$2b$') || str_starts_with($hash, '$2a$')) {
      $hash = '$2y$' . substr($hash, 4);
  }
  // --- end ---
  echo "$p -> ", substr($hash, 0, 7), " algoName=", password_get_info($hash)['algoName'], " verifies=", var_export(password_verify($pw, $hash), true), "\n";
}
