<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title')</title>

        {{-- Vue JS - only render for 'app' route --}}
        @if (Route::currentRouteName() === 'app') 
        <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
        @endif

        {{-- Fonts --}}
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        {{-- Bootstrap --}}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

        <link rel="stylesheet" href="{{ asset('css/style.css') }}"> 

    </head>
    <body class="view-{{ Route::currentRouteName() }}">

        @yield('content')

    </body>
</html>