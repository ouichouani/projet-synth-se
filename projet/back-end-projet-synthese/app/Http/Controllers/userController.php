<?php

namespace App\Http\Controllers;

use App\Events\newUserEvent;
use App\Mail\newUsermail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class userController extends Controller
{

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        if ($user->profile_image) {
            $user->profile_image = asset('storage/' .$user->profile_image) ;
        }
        newUserEvent::dispatch($user);
        return response()->json(['data' => $user], 200);        
    }
    
    public function store(Request $request)
    {
        //job to queue


        try{

            $validation = $request->validate([
                'name'          => 'required|string|min:3|max:100',
                'email'         => 'required|email|unique:users,email',
                'password'      => 'required|string|min:8|max:255',
                'bio'           => 'nullable|string|min:3|max:255',
                'profile_image' => 'nullable|file|max:2048|mimes:jpg,jpeg,png',
            ]);

            $path = 'user_imgs/default.jpg';
            if($request->hasFile('profile_image')){
                $path = $request->file('profile_image')->store('user_imgs' , 'public' );
            }

            $user = User::create([
                'name'      => $validation['name'] ,
                'email'     => $validation['email'] ,
                'password'  => Hash::make($validation['password']) ,
                'bio'       => $validation['bio'] ?? '',
                'admin'     => false ,
                'profile_image' => $path ,
            ]);
            Log::info("user with id = $user->id created") ;
            newUserEvent::dispatch($user) ;

            $user->profile_image = asset('storage/' . $user->profile_image ) ; 
            $token = $user->createToken('API_token')->plainTextToken;
            return response()->json(['message' => 'user created successfuly' , 'data' => $user , 'token' => $token]);

        }catch(ValidationException $e){
            return response()->json(['errors' => $e->errors()] , 422) ;
        }
    }

    public function update(Request $request)
    {
        try{
            
            $user = $request->user() ; //get user by token

            $validation = $request->validate([
                'name'          => 'nullable|string|min:3|max:100',
                'password'      => 'nullable|string|min:8|max:255',
                'bio'           => 'nullable|string|min:3|max:255',
                'profile_image' => 'nullable|file|max:2048|mimes:jpg,jpeg,png',
            ]);

            if($request->hasFile('profile_image')){
                if($user->profile_image && Storage::disk('public')->exists($user->profile_image) && $user->profile_image !== 'user_imgs/default.jpg' ){
                    Storage::disk('public')->delete($user->profile_image) ;
                }
                $path = $request->file('profile_image')->store('user_imgs' , 'public');

            }else if($request->boolean('delete_profile_image')){
                if($user->profile_image && Storage::disk('public')->exists($user->profile_image) && $user->profile_image !== 'user_imgs/default.jpg' ){
                    Storage::disk('public')->delete($user->profile_image) ;
                }
                $path = 'user_imgs/default.jpg';
            }else{
                $path = false;
            }

            if(!empty($validation['password'])){$user->password  = Hash::make($validation['password']) ;}   
            if(!empty($validation['name']) && $validation['name'] !== $user->name ){$user->name  = $validation['name'];}   
            if(!empty($validation['bio']) && $validation['bio'] !== $user->bio ){$user->bio  = $validation['bio'] ;}   
            if($path){$user->profile_image = $path  ;}   

            $user->save() ;
            Log::info("user with id = $user->id updated") ;

            $user->profile_image && $user->profile_image = asset('storage/' . $user->profile_image) ; 
            return response()->json(['message' => 'user updated successfuly' , 'data' => $user ]);

        }catch(ValidationException $e){
            return response()->json(['errors' => $e->errors()] , 402) ;
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }else{
            if($user->profile_image && Storage::disk('public')->exists($user->profile_image) && $user->profile_image !== 'user_imgs/default.jpg' ){
                Storage::disk('public')->delete($user->profile_image) ;
            }
            Log::info("user with id = $id deleted") ;
            $user->delete() ;
            return response()->json(['message' => 'User deleted successfuly.'], 200);   
        }
    }
}
