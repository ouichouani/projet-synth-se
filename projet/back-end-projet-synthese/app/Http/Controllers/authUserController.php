<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class authUserController extends Controller
{
    
    public function login(Request $request){



        try{

            $validation = $request->validate([
                'email' => 'required|email|filled' ,
                'password' => 'required|string|min:3|filled' ,
            ]);

            $user = User::where('email' , $validation['email'])->first() ;
            if(!$user || !Hash::check($validation['password'] , $user->password)){
                return response()->json(['message' => 'Authentication failed. Check your email or password.'], 401);
            }
            
                 
            $token = $user->createToken('API_Token')->plainTextToken;
            $user->profile_image = asset('storage/' .$user->profile_image) ;
            return response()->json(['message' => 'authentified successfuly' , 'data' => $user , 'token' => $token ], 200);
            

        }catch(ValidationException $e){
            return response()->json(['errors' => $e->errors()] , 422);
        }

    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken() ; // Get the token from the Authorization header (without "Bearer " prefix)
        $accessToken = PersonalAccessToken::findToken($token) ; // Hash the token and find the matching token record in the database
        if (! $accessToken || !$accessToken->tokenable) { // If the token is invalid or the associated user (tokenable) does not exist
            return response()->json([
                'message' => 'You are not logged in.'
            ], 401); // You can use 401 Unauthorized status code
        }
    
        $accessToken->tokenable->tokens()->delete(); // Delete all tokens associated with the authenticated user (log out from all devices)
        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

}
