<?php

namespace App\Http\Controllers;

use App\Models\Pin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class PinController extends Controller
{


    public function index()
    {
        $pins = Pin::with(['comments', 'user'])->get();
        foreach ($pins as $pin) {
            $pin->image_url && $pin->image_url = asset('storage/' . $pin->image_url);
        }
        return response()->json(['data' => $pins]);
    }

    public function userPins($user_id)
    {
        $pins = Pin::where('user_id' , $user_id )->with(['comments', 'user'])->get();
        foreach ($pins as $pin) {
            $pin->image_url && $pin->image_url = asset('storage/' . $pin->image_url);
        }
        return response()->json(['data' => $pins]);
    }

    public function show(Request $request, $id)
    {

        $pin = Pin::with(['comments', 'user'])
            ->withCount('likes')
            ->find($id);

        if (!$pin) {
            return response()->json(['message' => 'Pin not found.'], 404);
        }
        $pin->image_url && $pin->image_url = asset('storage/' . $pin->image_url);
        $pin->user->profile_image && $pin->user->profile_image = asset('storage/' . $pin->user->profile_image);


        // check if user is  a gest or authontified -----------------

        $token = $request->bearerToken() ;
        if($token){
            $accessToken = PersonalAccessToken::findToken($token) ; 

            if($accessToken && $accessToken->tokenable ){
                $user = $accessToken->tokenable ;
                $pin->liked_by_me = $pin->likes->contains('user_id', $user->id);
            }
        }

        //------------------------------------------------------------


        return response()->json(['data' => $pin], 200);
    }

    public function store(Request $request)
    {
        //job to queue

        try {

            $validation = $request->validate([
                'title'         => 'required|string|min:3|max:100',
                'description'   => 'nullable|min:3|max:3000',
                'is_public'     => 'required|boolean',
                'image_url'     => 'required|file|max:2048|mimes:jpg,jpeg,png',
            ]);

            if ($request->hasFile('image_url')) {
                $path = $request->file('image_url')->store('pin_imgs', 'public');
            }

            $pin = Pin::create([
                'title'      => $validation['title'],
                'description' => $validation['description'] ?? null,
                'is_public'  => $validation['is_public'],
                'user_id'    => $request->user()->id,
                'image_url'  => $path,
            ]);
            Log::info("user with id = $pin->id created") ;


            $pin->image_url = asset('storage/' . $pin->image_url);
            return response()->json(['message' => 'pin created successfuly', 'data' => $pin]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function update(Request $request, $id)
    {
        //job

        $pin = Pin::find($id); //get user by token
        try {
            if (!$pin) {
                return response()->json(['message', 'pin not found.']);
            }

            $validation = $request->validate([
                'title'         => 'nullable|string|min:3|max:100',
                'description'   => 'nullable|min:3|max:3000',
                'is_public'     => 'required|boolean',
                'image_url'     => 'nullable|file|max:2048|mimes:jpg,jpeg,png',
            ]);

            if ($request->hasFile('image_url')) {
                if ($pin->image_url && Storage::disk('public')->exists($pin->image_url) && $pin->image_url !== 'pin_imgs/default.jpg') {
                    Storage::disk('public')->delete($pin->image_url);
                }
                $path = $request->file('image_url')->store('pin_imgs', 'public');
            } else {
                $path = false;
            }

            if (!empty($validation['title'])) {
                $pin->title  = $validation['title'];
            }
            if (!empty($validation['description']) && $validation['description'] !== $pin->description) {
                $pin->description  = $validation['description'];
            }
            if (!empty($validation['is_public']) && $validation['is_public'] !== $pin->is_public) {
                $pin->is_public  = $validation['is_public'];
            }
            if ($path) {
                $pin->image_url = $path;
            }

            $pin->save();
            Log::info("user with id = $pin->id updated") ;

            $pin->image_url && $pin->image_url = asset('storage/' . $pin->image_url);
            return response()->json(['message' => 'pin updated successfuly', 'data' => $pin]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 402);
        }
    }


    public function destroy(Request $request, $id)
    {
        $pin = Pin::with('user')->find($id);
        if (!$pin) {
            return response()->json(['message' => 'Pin not found.'], 404);
        }
        if ($request->user()->admin || $pin->user_id == $request->user()->id) { // admin can delete any pin 

            if ($pin->image_url && Storage::disk('public')->exists($pin->image_url) && $pin->image_url !== 'pin_imgs/default.jpg') {
                Storage::disk('public')->delete($pin->image_url);
            }
            $pin->delete();
            Log::info("user with id = $pin->id deleted") ;

            return response()->json(['message' => 'Pin deleted successfuly.'], 200);

        } else {
            return response()->json(['message' => 'not allowed to delete this Pin .'], 403);
        }
    }
}
