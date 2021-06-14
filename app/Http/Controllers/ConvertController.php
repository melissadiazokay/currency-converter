<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversions; 

class ConvertController extends Controller {
    
    public function create(Request $request) {

        $conversion = new Conversions();
        $conversion->content = $request->content;

        $conversion->save();

        return redirect("/");
    }

    public function delete($id) {

        Conversions::destroy($id);

        return redirect("/");

    }

}