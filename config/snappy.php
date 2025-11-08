<?php
return [
    'pdf' => [
        'enabled' => true,
        'binary' => '"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"', // <-- wrap in double quotes
        'timeout' => false,
        'options' => [],
        'env'     => [],
    ],
    'image' => [
        'enabled' => true,
        'binary' => '"C:\Program Files\wkhtmltopdf\bin\wkhtmltoimage.exe"', // <-- wrap in double quotes
        'timeout' => false,
        'options' => [],
        'env'     => [],
    ],
];