<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title')</title>

        {{-- Vue JS - only render for 'app' route --}}
        @if (Route::currentRouteName() === 'app') 
        <script src="https://unpkg.com/vue@next"></script>
        @endif

        {{-- Fonts --}}
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        {{-- Bootstrap --}}
       <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

        <link rel="stylesheet" href="{{ asset('css/style.css') }}"> 

    </head>
    <body class="view-{{ Route::currentRouteName() }}">

        @yield('content')

    </body>
</html>

