<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversions;

class HomeController extends Controller {

    public function index(){

        $conversions = Conversions::all();

        return view('home',[
            'conversions' => $conversions
        ]);
    }
}
