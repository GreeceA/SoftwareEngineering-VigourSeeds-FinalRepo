<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Vigour Seeds')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" href="/vigour-logo.png?v=2" type="image/png" />

    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-50">
    <nav class="bg-gradient-to-r from-[#37692F] to-[#4a8a3f] shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <img src="/vigour-logo.png" alt="Vigour Seeds Logo" class="h-10 w-10" />
                    <span class="text-white text-xl font-bold tracking-tight">
                        <span class="font-extrabold">VIGOUR SEEDS</span>
                        <span class="font-light"> | Partner Portal</span>
                    </span>
                </div>
            </div>
        </div>
    </nav>
    <main>
        @yield('content')
    </main>
</body>
</html>